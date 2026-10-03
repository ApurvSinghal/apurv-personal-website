import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getContactRateLimitDecision } from "@/lib/rate-limit";
import { recordServerError } from "@/lib/newrelic";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  website: z.string().trim().max(200).optional(),
  formStartedAt: z.number().int().positive().optional(),
});

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
      console.error("Contact API misconfigured: missing Resend env vars", {
        hasResendApiKey: !!resendApiKey,
        hasFromEmail: !!fromEmail,
      });
      return NextResponse.json(
        {
          error:
            "Contact service is temporarily unavailable. Please try again in a minute or email me@apurvsinghal.com.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(resendApiKey);
    const submittedAt = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
    });

    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessageWithBreaks = escapeHtml(message).replace(
      /\n/g,
      "<br/>",
    );
    const safeNameForSubject = name.replace(/[\r\n]+/g, " ").trim();

    // 1. Send owner notification email
    let ownerSendResult: Awaited<ReturnType<typeof resend.emails.send>>;
    try {
      ownerSendResult = await resend.emails.send({
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
    } catch (sendError) {
      ownerSendResult = {
        data: null,
        error: {
          name: "application_error",
          message:
            sendError instanceof Error ? sendError.message : String(sendError),
          statusCode: 500,
        },
        headers: null,
      };
    }

    // If custom domain is unverified (403), attempt fallback to onboarding@resend.dev
    if (
      ownerSendResult?.error &&
      fromEmail !== "onboarding@resend.dev" &&
      (ownerSendResult.error.statusCode === 403 ||
        ownerSendResult.error.message?.toLowerCase().includes("domain") ||
        ownerSendResult.error.message?.toLowerCase().includes("verify"))
    ) {
      console.warn(
        `Custom domain sender '${fromEmail}' rejected by Resend (${ownerSendResult.error.message}). Retrying with 'onboarding@resend.dev'...`,
      );
      try {
        const fallbackResult = await resend.emails.send({
          from: "onboarding@resend.dev",
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
        if (!fallbackResult.error) {
          ownerSendResult = fallbackResult;
        } else {
          console.error(
            "Resend fallback sender also failed:",
            fallbackResult.error,
          );
        }
      } catch (fallbackError) {
        console.error("Resend fallback sender threw:", fallbackError);
      }
    }

    if (ownerSendResult?.error) {
      const err = new Error(
        `Resend owner notification failed: ${ownerSendResult.error.message} (${ownerSendResult.error.name})`,
      );
      console.error("Resend owner notification failed", {
        error: ownerSendResult.error.message,
        name: ownerSendResult.error.name,
        statusCode: ownerSendResult.error.statusCode,
      });

      await recordServerError(err, {
        resendErrorName: ownerSendResult.error.name,
        resendErrorMessage: ownerSendResult.error.message,
        recipient: adminEmail,
      });

      return NextResponse.json(
        {
          error:
            "Contact service is temporarily unavailable. Please try again in a minute or email me@apurvsinghal.com.",
        },
        { status: 503 },
      );
    }

    try {
      const ackResult = await resend.emails.send({
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

      if (ackResult?.error) {
        console.warn("Resend acknowledgement email failed", {
          error: ackResult.error.message,
          name: ackResult.error.name,
        });
      }
    } catch (ackError) {
      console.warn("Resend acknowledgement email threw", {
        error: ackError instanceof Error ? ackError.message : String(ackError),
      });
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Contact API unhandled error", {
      error: err.message,
    });
    await recordServerError(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
