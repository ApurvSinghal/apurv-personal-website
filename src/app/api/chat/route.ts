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

  if (lower.includes("project") || lower.includes("built") || lower.includes("portfolio")) {
    return `Apurv has built several notable production and AI projects:

1. **AI Personal Portfolio & Agent Platform** (this website!): Built with Next.js 16 (App Router & Turbopack), Tailwind CSS, and streaming AI assistant integration.
2. **Contact Pipeline Observability System**: A resilient lead-intake pipeline with strict Zod validation, honeypot defenses, Upstash rate limiting, and end-to-end Sentry telemetry.
3. **Enterprise AI Agents & Claude API Workflows**: Production workflow automation using Claude API, tool-calling agents, Model Context Protocol (MCP) servers, and RAG architectures.

You can explore detailed case studies in the [Projects](#projects) section!`;
  }

  if (lower.includes("azure") || lower.includes("cloud") || lower.includes("capgemini")) {
    return `Apurv has **8+ years of enterprise experience** shipping mission-critical systems on Microsoft Azure:

- **Lead Consultant at Capgemini** (2023 — Present): Leads cloud engineering teams, designs enterprise architectures, optimizes CI/CD pipelines, and mentors engineers.
- **Consultant at Capgemini** (2021 — 2023): Drove large-scale platform migrations and reliability initiatives.
- **Deep Technical Breadth**: Azure App Services, Azure Functions (Serverless), Azure OpenAI, Azure AI Foundry, Cosmos DB, Entra ID, and containerized microservices.

His enterprise background ensures that the AI agents he builds are reliable, observable, and ready for production constraints.`;
  }

  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) {
    return `Apurv's core skills span AI engineering and enterprise full-stack development:

- **AI & Agents**: Claude API, Google Gemini, OpenAI, RAG, Vector DBs, Model Context Protocol (MCP), Prompt Engineering, Tool Use.
- **Cloud & DevOps**: Microsoft Azure, Azure AI Foundry, Vercel, Docker, GitHub Actions CI/CD.
- **Backend**: TypeScript, Node.js, C#, .NET / ASP.NET Core, SQL Server, RESTful microservices.
- **Frontend**: Next.js, React, React Native, Tailwind CSS.

Check out the interactive [Skills](#skills) section for the complete breakdown!`;
  }

  if (lower.includes("hire") || lower.includes("contact") || lower.includes("work") || lower.includes("email")) {
    return `You can get in touch with Apurv directly:

- **Email**: [me@apurvsinghal.com](mailto:me@apurvsinghal.com)
- **LinkedIn**: [linkedin.com/in/apurvsinghal28](https://www.linkedin.com/in/apurvsinghal28)
- **Contact Form**: Scroll down to the [Contact Section](#contact) on this page to send a direct message.

He is based in **Melbourne, Australia** and is open to AI engineering advisory, contract projects, and consulting engagements!`;
  }

  return `Hello! I'm Apurv's AI representative. Apurv is an AI Engineer and Lead Cloud Consultant based in Melbourne with 8+ years shipping enterprise production systems on Azure, now specializing in AI agents, Claude API, and RAG pipelines.

Feel free to ask me about:
- His recent AI projects and architecture case studies
- His 8+ years of enterprise Azure & cloud leadership
- His technical skillset across AI, TypeScript, and .NET
- How to get in touch or collaborate with him!`;
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
