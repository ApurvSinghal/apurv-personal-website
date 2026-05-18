import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getContactRateLimitDecision } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  website: z.string().trim().max(200).optional(),
  formStartedAt: z.number().int().positive().optional(),
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

function getDurationMs(startTimeMs: number) {
  return Date.now() - startTimeMs;
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

  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const validationResult = contactSchema.safeParse(payload);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, and message." },
        { status: 400 },
      );
    }

    const { name, email, message, website, formStartedAt } =
      validationResult.data;

    if (website) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    }

    if (formStartedAt && Date.now() - formStartedAt < 1200) {
      return NextResponse.json(
        { error: "Please take a moment and try again." },
        { status: 400 },
      );
    }

    const clientIp = getClientIp(request);
    const rateLimitDecision = await getContactRateLimitDecision(clientIp);

    if (rateLimitDecision.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL || "me@apurvsinghal.com";

    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        {
          error:
            "Contact service is temporarily unavailable. Please try again in a minute or email me@apurvsinghal.com.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(resendApiKey);
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessageWithBreaks = escapeHtml(message).replace(
      /\n/g,
      "<br/>",
    );
    const safeNameForSubject = name.replace(/[\r\n]+/g, " ").trim();

    try {
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
    } catch (error) {
      console.error("Resend owner notification failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        {
          error:
            "Contact service is temporarily unavailable. Please try again in a minute or email me@apurvsinghal.com.",
        },
        { status: 503 },
      );
    }

    const emailDurationMs = getDurationMs(requestStartedAtMs);

    try {
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
    } catch (error) {
      console.warn("Resend acknowledgement email failed", {
        emailDomain: getEmailDomain(email),
        emailDurationMs,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API unhandled error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
