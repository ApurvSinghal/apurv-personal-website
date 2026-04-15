import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  flushNewRelic,
  getDurationMs,
  getErrorAttributes,
  recordNewRelicEvent,
} from "@/lib/newrelic";
import { getContactRateLimitDecision } from "@/lib/rate-limit";
import { insertContactMessage } from "@/lib/supabase";

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const requestStartedAtMs = Date.now();
  const receivedAt = new Date().toISOString();
  const requestPath = request.nextUrl.pathname;
  const requestHost = request.headers.get("host") ?? "unknown";
  const referrer = request.headers.get("referer") ?? "direct";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  try {
    const payload = await request.json();
    const validationResult = contactSchema.safeParse(payload);

    if (!validationResult.success) {
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "validation_failed",
        receivedAt,
        requestHost,
        requestPath,
        referrer,
        totalDurationMs: getDurationMs(requestStartedAtMs),
        userAgent,
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
    const clientIpKnown = clientIp !== "unknown";
    let emailOutcome = "not_attempted";
    let emailDurationMs = 0;
    let supabaseDurationMs = 0;

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "submit_received",
      clientIpKnown,
      receivedAt,
      emailDomain,
      messageLength,
      referrer,
      requestHost,
      requestPath,
      userAgent,
    });

    const rateLimitDecision = await getContactRateLimitDecision(clientIp);

    if (rateLimitDecision.limited) {
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "rate_limited",
        clientIpKnown,
        currentRequestCount: rateLimitDecision.currentCount,
        receivedAt,
        emailDomain,
        messageLength,
        requestPath,
        rateLimitSource: rateLimitDecision.source,
        totalDurationMs: getDurationMs(requestStartedAtMs),
      });
      await flushNewRelic();
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "rate_limit_checked",
      clientIpKnown,
      currentRequestCount: rateLimitDecision.currentCount,
      receivedAt,
      requestPath,
      rateLimitSource: rateLimitDecision.source,
    });

    try {
      const supabaseStartedAtMs = Date.now();
      await insertContactMessage({
        name,
        email,
        message,
      });
      supabaseDurationMs = getDurationMs(supabaseStartedAtMs);
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "supabase_insert_success",
        receivedAt,
        emailDomain,
        messageLength,
        requestPath,
        supabaseDurationMs,
      });
    } catch (databaseError) {
      console.error("Supabase error:", databaseError);
      supabaseDurationMs = getDurationMs(requestStartedAtMs);
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "supabase_insert_failed",
        receivedAt,
        emailDomain,
        requestPath,
        supabaseDurationMs,
        totalDurationMs: getDurationMs(requestStartedAtMs),
        ...getErrorAttributes(databaseError),
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
        const emailStartedAtMs = Date.now();
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

        emailDurationMs = getDurationMs(emailStartedAtMs);
        emailOutcome = "sent";

        await recordNewRelicEvent("ContactFlowEvent", {
          stage: "email_notifications_sent",
          receivedAt,
          emailDomain,
          emailDurationMs,
          requestPath,
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
        emailDurationMs = getDurationMs(requestStartedAtMs);
        emailOutcome = "failed";
        await recordNewRelicEvent("ContactFlowEvent", {
          stage: "email_notifications_failed",
          receivedAt,
          emailDomain,
          emailDurationMs,
          requestPath,
          ...getErrorAttributes(emailError),
        });
      }
    } else {
      console.warn(
        "Resend not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL"
      );
      emailOutcome = "skipped";
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "email_notifications_skipped",
        receivedAt,
        requestPath,
      });
    }

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "response_success",
      emailDurationMs,
      emailOutcome,
      receivedAt,
      emailDomain,
      messageLength,
      requestPath,
      responseStatus: 200,
      supabaseDurationMs,
      totalDurationMs: getDurationMs(requestStartedAtMs),
    });
    await flushNewRelic();

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "response_error",
      receivedAt,
      requestPath,
      responseStatus: 500,
      totalDurationMs: getDurationMs(requestStartedAtMs),
      userAgent,
      ...getErrorAttributes(error),
    });
    await flushNewRelic();
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
