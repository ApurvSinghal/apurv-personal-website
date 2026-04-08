import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { flushNewRelic, recordNewRelicEvent } from "@/lib/newrelic";
import { insertContactMessage } from "@/lib/supabase";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const contactRequestCounts = new Map<string, { count: number; windowStart: number }>();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
});

function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = contactRequestCounts.get(ip);

  if (!entry || now - entry.windowStart >= CONTACT_RATE_LIMIT_WINDOW_MS) {
    contactRequestCounts.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;

  if (contactRequestCounts.size > 1000) {
    for (const [trackedIp, trackedEntry] of contactRequestCounts.entries()) {
      if (now - trackedEntry.windowStart >= CONTACT_RATE_LIMIT_WINDOW_MS) {
        contactRequestCounts.delete(trackedIp);
      }
    }
  }

  return entry.count > CONTACT_RATE_LIMIT_MAX_REQUESTS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();

  try {
    const payload = (await request.json()) as Partial<ContactPayload>;
    const validationResult = contactSchema.safeParse(payload);

    if (!validationResult.success) {
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "validation_failed",
        receivedAt,
      });
      await flushNewRelic();
      return NextResponse.json(
        { error: "Please provide a valid name, email, and message." },
        { status: 400 },
      );
    }

    const { name, email, message } = validationResult.data;
    const messageLength = message?.length ?? 0;
    const emailDomain = email ? getEmailDomain(email) : "unknown";
    const clientIp = getClientIp(request);

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "submit_received",
      receivedAt,
      emailDomain,
      messageLength,
    });

    if (isRateLimited(clientIp)) {
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "rate_limited",
        receivedAt,
      });
      await flushNewRelic();
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    try {
      await insertContactMessage({
        name,
        email,
        message,
      });
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "supabase_insert_success",
        receivedAt,
        emailDomain,
        messageLength,
      });
    } catch (databaseError) {
      console.error("Supabase error:", databaseError);
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "supabase_insert_failed",
        receivedAt,
        emailDomain,
      });
      await flushNewRelic();
      return NextResponse.json(
        {
          error:
            "Contact service is temporarily unavailable. Please try again in a minute or email admin@apurvsinghal.com.",
        },
        { status: 503 },
      );
    }

    // Resend email notifications
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL || "admin@apurvsinghal.com";

    if (resendApiKey && fromEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const submittedAt = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        const escapedName = escapeHtml(name);
        const escapedEmail = escapeHtml(email);
        const escapedMessageWithBreaks = escapeHtml(message).replace(/\n/g, "<br/>");
        const safeNameForSubject = name.replace(/[\r\n]+/g, " ").trim();

        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `New contact form submission: ${safeNameForSubject}`,
          replyTo: email,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSubmitted at: ${submittedAt}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${escapedName}</p>
            <p><strong>Email:</strong> ${escapedEmail}</p>
            <p><strong>Message:</strong><br/>${escapedMessageWithBreaks}</p>
            <p><strong>Submitted at:</strong> ${submittedAt}</p>
          `,
        });

        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: `Thanks for reaching out, ${safeNameForSubject}`,
          replyTo: adminEmail,
          text: `Hi ${name},\n\nThanks for reaching out! I have received your message and will get back to you within 24-48 hours.\n\nFor your reference, here is a copy of your message:\n\n${message}\n\nBest,\nApurv Singhal`,
          html: `
            <p>Hi ${escapedName},</p>
            <p>Thanks for reaching out! I have received your message and will get back to you within 24-48 hours.</p>
            <p><strong>Your message:</strong></p>
            <p>${escapedMessageWithBreaks}</p>
            <p>Best,<br/>Apurv Singhal</p>
          `,
        });

        await recordNewRelicEvent("ContactFlowEvent", {
          stage: "email_notifications_sent",
          receivedAt,
          emailDomain,
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
        await recordNewRelicEvent("ContactFlowEvent", {
          stage: "email_notifications_failed",
          receivedAt,
          emailDomain,
        });
      }
    } else {
      console.warn(
        "Resend not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL"
      );
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "email_notifications_skipped",
        receivedAt,
      });
    }

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "response_success",
      receivedAt,
      emailDomain,
      messageLength,
    });
    await flushNewRelic();

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "response_error",
      receivedAt,
    });
    await flushNewRelic();
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
