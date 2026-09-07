import type { PostBriefing } from "./generator.ts";

export interface SendBriefingParams {
  tweetId?: string;
  tweetText: string;
  pillar: string;
  source: string;
  briefing: PostBriefing;
  isDryRun?: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildBriefingEmailHtml(params: SendBriefingParams): string {
  const { tweetId, tweetText, pillar, source, briefing, isDryRun } = params;
  const liveUrl = tweetId
    ? `https://x.com/apurvsinghal28/status/${tweetId}`
    : "https://x.com/apurvsinghal28";

  const talkingPointsHtml = briefing.talkingPoints && briefing.talkingPoints.length > 0
    ? briefing.talkingPoints
        .map(
          (point) =>
            `<li style="margin-bottom: 8px; color: #cbd5e1; line-height: 1.5;">${escapeHtml(point)}</li>`,
        )
        .join("")
    : "<li style=\"color: #94a3b8;\">Focus on practitioner experience and defensive production architecture.</li>";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Technical Briefing: ${escapeHtml(pillar)}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    
    <!-- Top Header Banner -->
    <div style="padding: 24px 28px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-bottom: 1px solid #1e293b;">
      <div style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #a5b4fc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
        ${escapeHtml(pillar)} · ${escapeHtml(source.toUpperCase())} ${isDryRun ? "(SIMULATION)" : ""}
      </div>
      <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #ffffff;">
        Daily Technical Briefing
      </h1>
      <p style="margin: 0; font-size: 14px; color: #94a3b8;">
        Published to @apurvsinghal28 on ${new Date().toLocaleDateString("en-AU", { weekday: "long", month: "short", day: "numeric" })}
      </p>
    </div>

    <div style="padding: 24px 28px;">
      
      <!-- Card 1: The Published Tweet -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 14px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">
          📱 Published Post (${tweetText.length}/280 chars)
        </h2>
        <div style="background-color: #1e293b; border-left: 4px solid #6366f1; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap;">${escapeHtml(tweetText)}</p>
        </div>
        ${
          !isDryRun
            ? `<a href="${liveUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">View Live on X →</a>`
            : `<span style="font-size: 13px; color: #a5b4fc; font-weight: 500;">✓ Dry-Run Mode — Verified without live publish</span>`
        }
      </div>

      <!-- Card 2: Technical Deep Dive -->
      <div style="background-color: #131d33; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; display: flex; align-items: center;">
          🧠 Architectural Concept
        </h2>
        <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
          ${escapeHtml(briefing.concept)}
        </p>
        <h3 style="font-size: 13px; font-weight: 600; color: #a5b4fc; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.04em;">
          Why It Matters in Enterprise
        </h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
          ${escapeHtml(briefing.whyItMatters)}
        </p>
      </div>

      <!-- Card 3: Concrete Implementation Example -->
      <div style="background-color: #131d33; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <h2 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0;">
            💻 Code Implementation
          </h2>
          <span style="font-size: 11px; font-weight: 600; color: #38bdf8; text-transform: uppercase; background: rgba(56, 189, 248, 0.1); padding: 2px 8px; border-radius: 4px;">
            ${escapeHtml(briefing.example.language || "Code")}
          </span>
        </div>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8;">
          ${escapeHtml(briefing.example.description)}
        </p>
        <pre style="margin: 0; background-color: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 14px; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12.5px; line-height: 1.5; color: #a5f3fc;"><code>${escapeHtml(briefing.example.code)}</code></pre>
      </div>

      <!-- Card 4: Discussion & Follow-Up Playbook -->
      <div style="background-color: #131d33; border: 1px solid #1e293b; border-radius: 8px; padding: 18px;">
        <h2 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0;">
          💬 Engagement & Talking Points
        </h2>
        <ul style="margin: 0; padding-left: 20px; font-size: 13.5px;">
          ${talkingPointsHtml}
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 16px 28px; background-color: #0b0f19; border-top: 1px solid #1e293b; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        Automated Daily Technical Briefing Engine · <a href="https://apurvsinghal.com" style="color: #6366f1; text-decoration: none;">apurvsinghal.com</a>
      </p>
    </div>

  </div>
</body>
</html>
`;
}

export function buildBriefingEmailText(params: SendBriefingParams): string {
  const { tweetText, pillar, source, briefing, isDryRun } = params;
  const talkingPoints =
    briefing.talkingPoints && briefing.talkingPoints.length > 0
      ? briefing.talkingPoints.map((tp) => `  • ${tp}`).join("\n")
      : "  • Focus on practitioner experience and defensive production architecture.";

  return `DAILY TECHNICAL BRIEFING: ${pillar.toUpperCase()}
Source: ${source.toUpperCase()}${isDryRun ? " (Simulation)" : ""}
Date: ${new Date().toLocaleDateString("en-AU", { weekday: "long", month: "short", day: "numeric" })}

==================================================
PUBLISHED POST (${tweetText.length}/280 chars):
==================================================
${tweetText}

==================================================
ARCHITECTURAL CONCEPT:
==================================================
${briefing.concept}

Why It Matters in Enterprise:
${briefing.whyItMatters}

==================================================
CODE IMPLEMENTATION (${briefing.example.language || "Code"}):
==================================================
${briefing.example.description}

${briefing.example.code}

==================================================
ENGAGEMENT & TALKING POINTS:
==================================================
${talkingPoints}

--------------------------------------------------
Automated Daily Technical Briefing Engine · apurvsinghal.com
`;
}

export interface EmailSendResult {
  success: boolean;
  skipped: boolean;
  reason?: string;
  emailId?: string;
  recipient: string;
  from: string;
}

export async function sendPostBriefingEmail(params: SendBriefingParams): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "me@apurvsinghal.com";
  let fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio <noreply@apurvsinghal.com>";

  if (!resendApiKey) {
    const reason = "RESEND_API_KEY secret is not configured in GitHub repository secrets.";
    console.log(`\n[notifier] ⚠️ Notice: ${reason}`);
    console.log("[notifier] 👉 Add RESEND_API_KEY to https://github.com/ApurvSinghal/apurv-personal-website/settings/secrets/actions to enable email briefings.\n");
    return {
      success: false,
      skipped: true,
      reason,
      recipient: toEmail,
      from: fromEmail,
    };
  }

  // Clean, professional subject line without spam-trigger symbols
  const subject = `Daily Technical Briefing: ${params.pillar}${params.isDryRun ? " [Test]" : ""}`;
  const html = buildBriefingEmailHtml(params);
  const text = buildBriefingEmailText(params);

  async function postToResend(sender: string): Promise<{ ok: boolean; status: number; text: string; data?: { id?: string } }> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: sender,
        to: [toEmail],
        replyTo: toEmail,
        subject,
        html,
        text,
      }),
    });

    const respText = await response.text().catch(() => "");
    let data: { id?: string } | undefined;
    try {
      data = JSON.parse(respText) as { id?: string };
    } catch {
      // ignore
    }
    return { ok: response.ok, status: response.status, text: respText, data };
  }

  try {
    let result = await postToResend(fromEmail);

    // If custom domain is unverified (403/422), attempt automatic fallback to onboarding@resend.dev
    if (!result.ok && fromEmail !== "onboarding@resend.dev" && (result.status === 403 || result.status === 422)) {
      console.log(`[notifier] ⚠️ Custom domain sender '${fromEmail}' not accepted by Resend (${result.status}: ${result.text}).`);
      console.log("[notifier] 🔄 Retrying with Resend fallback sender 'onboarding@resend.dev'...");
      fromEmail = "onboarding@resend.dev";
      result = await postToResend(fromEmail);
    }

    if (!result.ok) {
      console.warn(`[notifier] ❌ Resend email delivery failed (${result.status}):`, result.text);
      let advice = "";
      if (result.text.includes("verify your domain")) {
        advice = "Verify apurvsinghal.com in your Resend dashboard (https://resend.com/domains) or use onboarding@resend.dev.";
      } else if (result.text.includes("can only send testing emails to your own email address")) {
        advice = "Testing emails from onboarding@resend.dev can only be sent to the email address registered with your Resend account. Set CONTACT_NOTIFICATION_EMAIL secret to match that email.";
      }
      if (advice) {
        console.warn(`[notifier] 👉 Action needed: ${advice}`);
      }
      return {
        success: false,
        skipped: false,
        reason: `HTTP ${result.status}: ${result.text} ${advice ? `(${advice})` : ""}`.trim(),
        recipient: toEmail,
        from: fromEmail,
      };
    }

    const emailId = result.data?.id || "ok";
    console.log(`✉️ Technical briefing email successfully delivered to ${toEmail} from ${fromEmail}! (Email ID: ${emailId})`);
    return {
      success: true,
      skipped: false,
      emailId,
      recipient: toEmail,
      from: fromEmail,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn("[notifier] ❌ Resend network error:", errorMsg);
    return {
      success: false,
      skipped: false,
      reason: errorMsg,
      recipient: toEmail,
      from: fromEmail,
    };
  }
}
