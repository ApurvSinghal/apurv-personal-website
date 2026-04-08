import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { flushNewRelic, recordNewRelicEvent } from "@/lib/newrelic";
import { insertContactMessage } from "@/lib/supabase";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}

export async function POST(request: NextRequest) {
  const receivedAt = new Date().toISOString();

  try {
    const payload = (await request.json()) as Partial<ContactPayload>;
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();
    const messageLength = message?.length ?? 0;
    const emailDomain = email ? getEmailDomain(email) : "unknown";

    await recordNewRelicEvent("ContactFlowEvent", {
      stage: "submit_received",
      receivedAt,
      emailDomain,
      messageLength,
    });

    if (!name || !email || !message) {
      await recordNewRelicEvent("ContactFlowEvent", {
        stage: "validation_failed",
        receivedAt,
      });
      await flushNewRelic();
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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

        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `New contact form submission: ${name}`,
          replyTo: email,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSubmitted at: ${submittedAt}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
            <p><strong>Submitted at:</strong> ${submittedAt}</p>
          `,
        });

        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: `Thanks for reaching out, ${name}`,
          replyTo: adminEmail,
          text: `Hi ${name},\n\nThanks for reaching out! I have received your message and will get back to you within 24-48 hours.\n\nFor your reference, here is a copy of your message:\n\n${message}\n\nBest,\nApurv Singhal`,
          html: `
            <p>Hi ${name},</p>
            <p>Thanks for reaching out! I have received your message and will get back to you within 24-48 hours.</p>
            <p><strong>Your message:</strong></p>
            <p>${String(message).replace(/\n/g, "<br/>")}</p>
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
