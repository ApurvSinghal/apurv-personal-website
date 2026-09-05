import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { APURV_GROUND_TRUTH } from "@/lib/agent-knowledge";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

// Simple in-memory sliding window rate limiter
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// Fallback intelligent response generator if GEMINI_API_KEY is not yet configured
function generateMockResponse(query: string): string {
  const lower = query.toLowerCase();

  if (
    lower.includes("adm") ||
    lower.includes("guard") ||
    lower.includes("company") ||
    lower.includes("product") ||
    lower.includes("compliance")
  ) {
    return `**ADM Guard** ([www.admguard.com.au](https://www.admguard.com.au)) is Apurv Singhal's company and flagship product — "the compliance flight recorder for automated decisions".

Key Highlights:
- **The Regulatory Need**: Solves the mandatory **10 December 2026** Australian Privacy Act APP 1.7–1.9 deadline (Privacy and Other Legislation Amendment Act 2024), which requires Australian businesses to evidence every automated decision materially affecting people.
- **Code-Layer Evidence**: Replaces static policy PDFs and out-of-sync spreadsheets with automated runtime instrumentation that cannot drift.
- **Zero-PII By Architecture**: Rejects personal information at the ingestion boundary with HTTP 422 before persistence. Only opaque subject tokens are accepted.
- **Cryptographic Tamper-Evidence**: SHA-256 hash chains + Merkle trees anchored to **Azure Australia East WORM** (Write-Once-Read-Many) storage.
- **Developer-First**: One API call to integrate with drop-in SDKs (Python, Node, Go) and client idempotency key retries.

Visit [www.admguard.com.au](https://www.admguard.com.au) or explore the case study in the [Projects](#projects) section!`;
  }

  if (lower.includes("project") || lower.includes("built") || lower.includes("portfolio")) {
    return `Apurv has built several notable production systems and AI products:

1. **ADM Guard** ([www.admguard.com.au](https://www.admguard.com.au)): The compliance flight recorder for automated decisions. Solves Australia's Privacy Act APP 1.7–1.9 with zero-PII boundary validation, Merkle hash chains, and Azure WORM storage.
2. **Interactive RAG Portfolio Agent** (this website!): Built with Next.js 16 (App Router & Turbopack), Tailwind CSS, streaming AI assistant integration, and in-chat lead capture.
3. **Contact Pipeline Observability System**: A resilient lead-intake pipeline with strict Zod validation, honeypot defenses, Upstash rate limiting, and end-to-end Sentry telemetry.

You can explore detailed case studies in the [Projects](#projects) section!`;
  }

  if (
    lower.includes("azure") ||
    lower.includes("cloud") ||
    lower.includes("devops") ||
    lower.includes("platform") ||
    lower.includes("capgemini")
  ) {
    return `Apurv has **8+ years of enterprise experience** across **Azure Cloud + DevOps** and **Platform Engineering**:

- **Lead Consultant at Capgemini** (2023 — Present, Full-Time): Leads platform engineering teams, designs enterprise Azure architectures, implements automated GitHub Actions CI/CD pipelines, and optimizes cloud reliability and deployment velocity.
- **Consultant at Capgemini** (2021 — 2023): Led large-scale platform migrations and cloud reliability initiatives on Microsoft Azure.
- **Founder of ADM Guard** ([www.admguard.com.au](https://www.admguard.com.au)): Built automated compliance flight recorder infrastructure on Azure Australia East with WORM storage policies.
- **Technical Breadth**: Azure Landing Zones, Docker, Terraform / Bicep, Azure Functions (Serverless), Azure OpenAI & AI Foundry, Cosmos DB, Entra ID, and containerized microservices.

His deep platform and DevOps background ensures that the cloud infrastructure and AI systems he builds are rock-solid, automated, and observable.`;
  }

  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("pillar") || lower.includes("area")) {
    return `Apurv's core work area centers on three foundational pillars:

1. **Azure Cloud + DevOps**: Microsoft Azure, GitHub Actions CI/CD pipelines, Docker containerization, Terraform / Bicep IaC, Azure Functions (Serverless), monitoring & telemetry.
2. **Platform Engineering**: Enterprise landing zones, platform migrations, developer platform velocity, microservices architecture, and SRE/reliability.
3. **Applied AI & Systems**: Azure AI Foundry, Azure OpenAI, Claude API, AI Agents, tool calling, RAG architectures, vector databases, and APP 1.7 compliance (ADM Guard).

Check out the interactive [Skills](#skills) section for the complete breakdown!`;
  }

  if (lower.includes("hire") || lower.includes("contact") || lower.includes("work") || lower.includes("email")) {
    return `You can get in touch with Apurv directly:

- **Email**: [me@apurvsinghal.com](mailto:me@apurvsinghal.com)
- **LinkedIn**: [linkedin.com/in/apurvsinghal28](https://www.linkedin.com/in/apurvsinghal28)
- **ADM Guard**: [www.admguard.com.au](https://www.admguard.com.au)
- **Contact Form**: Scroll down to the [Contact Section](#contact) on this page to send a direct message.

He is based in **Melbourne, Australia** and is open to cloud, platform engineering, and AI advisory or consulting engagements!`;
  }

  return `Hello! I'm Apurv's AI representative. Apurv is a Lead Consultant at Capgemini and Founder of **[ADM Guard](https://www.admguard.com.au)** with 8+ years of enterprise experience across three core pillars:
1. **Azure Cloud + DevOps**
2. **Platform Engineering**
3. **Applied AI & Systems**

Feel free to ask me about:
- His Azure Cloud, DevOps & Platform Engineering track record
- His applied AI systems and ADM Guard compliance platform
- His technical skillset across cloud, containers, and backend systems
- How to get in touch or book an advisory session!`;
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a minute before sending another." },
        { status: 429 },
      );
    }

    const json = await req.json();
    const parseResult = chatRequestSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parseResult.error.flatten() },
        { status: 400 },
      );
    }

    const { messages } = parseResult.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is provided, stream the fallback grounded response
    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1].content;
      const fallbackText = generateMockResponse(lastUserMsg);

      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackText.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            controller.enqueue(new TextEncoder().encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    }

    // Call Google Gemini 1.5/2.0 Flash REST API with streaming
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: APURV_GROUND_TRUTH }],
      },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      },
    );

    if (!geminiRes.ok || !geminiRes.body) {
      const errorText = await geminiRes.text();
      console.error("[Gemini API Error]", geminiRes.status, errorText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 },
      );
    }

    // Transform Gemini SSE stream into plain text stream for the client
    const reader = geminiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const stream = new ReadableStream({
      async pull(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const dataStr = trimmed.slice(6).trim();
              if (!dataStr || dataStr === "[DONE]") continue;

              try {
                const parsed = JSON.parse(dataStr);
                const text =
                  parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(new TextEncoder().encode(text));
                }
              } catch {
                // ignore parsing partial JSON chunks
              }
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.error("[Chat Route Exception]", err);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 },
    );
  }
}
