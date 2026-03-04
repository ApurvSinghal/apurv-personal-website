import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
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
      } catch (emailError) {
        console.error("Resend error:", emailError);
      }
    } else {
      console.warn(
        "Resend not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL"
      );
    }

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
