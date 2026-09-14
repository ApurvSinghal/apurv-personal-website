export interface ContentPillar {
  dayName: string;
  pillar: string;
  theme: string;
  hashtags: string;
}

export interface PostBriefing {
  tweet?: string;
  concept: string;
  whyItMatters: string;
  example: {
    language: string;
    description: string;
    code: string;
  };
  talkingPoints: string[];
}

export const PILLAR_SCHEDULE: Record<number, ContentPillar> = {
  1: {
    dayName: "Monday",
    pillar: "Azure Cloud & DevOps",
    theme: "Infrastructure as Code, multi-subscription landing zones, Bicep/Terraform gotchas, CI/CD pipeline automation.",
    hashtags: "#Azure #DevOps",
  },
  2: {
    dayName: "Tuesday",
    pillar: "Platform Engineering",
    theme: "Internal developer platforms, developer velocity, platform migrations, containerization, SRE.",
    hashtags: "#PlatformEngineering #Cloud",
  },
  3: {
    dayName: "Wednesday",
    pillar: "Applied AI & Systems",
    theme: "Azure AI Foundry, Claude API, production RAG pitfalls, agent tool-calling patterns, latency optimization.",
    hashtags: "#AppliedAI #Architecture",
  },
  4: {
    dayName: "Thursday",
    pillar: "Founder & ADM Guard",
    theme: "Automated decision compliance, Australia's Privacy Act APP 1.7-1.9, zero-PII boundary design, immutable WORM storage.",
    hashtags: "#RegTech #BuildInPublic",
  },
  5: {
    dayName: "Friday",
    pillar: "Enterprise Delivery & Governance",
    theme: "Lessons from 8+ years shipping enterprise production systems, navigating corporate governance, observable architecture.",
    hashtags: "#SoftwareEngineering #TechLead",
  },
  6: {
    dayName: "Saturday",
    pillar: "Community & IT Leadership",
    theme: "Pro bono technology leadership, non-profit digital safeguarding, Entra ID identity hygiene, volunteer tech governance.",
    hashtags: "#Community #Leadership",
  },
  0: {
    dayName: "Sunday",
    pillar: "Engineer Reflections",
    theme: "Engineering mindset, system design first principles, balancing enterprise consulting and startup building.",
    hashtags: "#BuildingInPublic #Engineering",
  },
};

export const EVERGREEN_TOPIC_BANK: Record<string, string[]> = {
  "Azure Cloud & DevOps": [
    "Most enterprise cloud migrations stall not from containers or DBs, but because nobody designed landing zone governance on Day 1.\n\nAutomate policy guardrails with Terraform before granting developer access. Saves months of rework. #Azure",
    "CI/CD pipelines shouldn't just run unit tests; they should enforce architecture guardrails.\n\nIn our GitHub Actions, we reject PRs that introduce unpinned dependencies or drift from Bicep landing zone specs before code review starts. #DevOps",
    "Clean Terraform pattern for Azure:\nSeparate state by lifecycle frequency, not by environment.\n\nVNet/Landing zones (yearly) ≠ AKS clusters (monthly) ≠ App deploys (daily).\n\nBlast radius shrinks to near zero. #Azure #DevOps",
    "The biggest mistake teams make with Azure Managed Identities:\nGranting Contributor at the Resource Group level.\n\nScope down to individual Key Vaults and Storage Queues with custom RBAC roles on Day 1. What's your lockdown default? #Azure",
  ],
  "Platform Engineering": [
    "The secret to Platform Engineering:\nDon't build an internal developer portal nobody asked for.\n\nFind the 3 manual tickets filed every week (secret rotation, staging DB, preview envs) and automate them into a self-service CLI. #PlatformEngineering",
    "Developer velocity isn't how fast developers type code.\n\nIt's how little friction stands between git push and production verification with zero fear of breaking the build. That is the true measure of platform quality. #Cloud",
    "Platform migrations fail when teams try a global cutover. Run traffic in parallel with dark launches and feature flags. If you can't observe both side-by-side in real-time, you're not migrating—you're gambling. #PlatformEngineering",
    "Unpopular opinion on Platform Engineering:\nIf developers need a 40-page Notion doc to spin up an ephemeral test environment, your platform is just legacy ticket-ops with modern branding. #DevOps",
  ],
  "Applied AI & Systems": [
    "The biggest pitfall in enterprise RAG isn't the vector DB or embedding model—it's chunk boundary quality and metadata filtering.\n\nWithout document hierarchy and access scopes, your LLM retrieves garbage with high confidence. #AppliedAI",
    "Building AI agents that work in production requires treating tool calling like distributed systems RPC:\n\n1. Client idempotency keys\n2. Strict Zod/Pydantic validation\n3. Deterministic fallbacks when models hallucinate args. #Architecture",
    "Prompt caching on Azure OpenAI and Claude is the highest ROI win in production AI.\n\nCaching multi-shot system prompts cut our prompt evaluation latency by ~70% and slashed API token costs dramatically. #AppliedAI",
    "Stop benchmarking LLMs on synthetic puzzles.\nTest them on dirty production data: half-empty JSON payloads, malformed markdown, and ambiguous user prompts.\n\nThat's where architectures either shine or silently collapse. #AppliedAI",
  ],
  "Founder & ADM Guard": [
    "Under Australia's Privacy Act APP 1.7–1.9, companies automating decisions affecting individuals must evidence how decisions were made.\n\nStatic PDF policies won't protect you in an OAIC audit. You need code-layer flight recorders. #RegTech",
    "When architecting ADM Guard, rule #1 was zero-PII by design.\n\nIf an API payload contains names, emails, or tax IDs, the boundary rejects it with HTTP 422 before persistence.\n\nYou cannot leak data you never store. #RegTech #BuildInPublic",
    "Why standard DBs fail for decision audit logs:\nIf an admin or DBA can run UPDATE or DELETE, it cannot pass cryptographic muster.\n\nThat's why ADM Guard chains decisions in SHA-256 Merkle trees anchored to Azure Australia East WORM. #Azure",
    "Automating high-stakes decisions without cryptographic audit trails is a ticking liability bomb.\nWhen regulators ask 'Why was this customer flagged?', 'The AI model outputted it' won't hold up in court. #RegTech",
  ],
  "Enterprise Delivery & Governance": [
    "In enterprise consulting, the hardest problem is rarely technical architecture—it's organizational alignment.\n\nA simple architecture with 100% buy-in beats a 'flawless' system that teams resist using every single time. #TechLead",
    "After 8+ years shipping enterprise production systems, my golden rule:\n\nDesign for the failure mode first. If you don't know what happens when downstream returns HTTP 504, you haven't finished designing. #SoftwareEngineering",
    "Technical debt is never paid off in 'refactoring sprints'.\nYou pay it down incrementally by making the clean path easier than the shortcut on every single PR. How does your team enforce this? #TechLead",
  ],
  "Community & IT Leadership": [
    "Managing IT for community non-profits reminds me that tech hygiene matters most where budgets are tightest.\n\nEnforcing strict Entra ID MFA and domain security protects vulnerable community helplines from compromise. #Leadership",
    "The best non-profit tech leadership isn't introducing fancy new stacks.\nIt's deprecating legacy shadow IT, locking down phishing vectors, and giving volunteers tools that just work. #Leadership",
  ],
  "Engineer Reflections": [
    "Balancing enterprise consulting while building a tech startup:\n\nThe key is zero context-switching during focus blocks.\n\nEnterprise delivery builds discipline; startups demand speed. Both make you a sharper engineer. #BuildingInPublic",
    "Early in your career, you measure progress by how much code you write.\nLater on, you measure progress by how much complexity you prevented from reaching production. What made that shift for you? #Engineering",
  ],
};

export function sanitizeGeneratedText(raw: string): string {
  if (!raw) return "";
  let text = raw.trim();

  // Strip code blocks if present
  if (text.startsWith("```") && text.endsWith("```")) {
    text = text.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  // Remove common conversational LLM intros
  text = text.replace(/^(here(?:'s| is) (?:a |the )?(?:tweet|post|draft|thought):?\s*)/i, "");

  // Strip leading and trailing quotes (including typographic quotes)
  text = text.replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "").trim();
  text = text.replace(/^(here(?:'s| is) (?:a |the )?(?:tweet|post|draft|thought):?\s*)/i, "").trim();
  text = text.replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "").trim();

  // Normalize excessive line breaks
  text = text.replace(/\n{3,}/g, "\n\n");

  return text;
}

async function callGeminiApi(prompt: string, apiKey: string): Promise<string | null> {
  const preferredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const modelsToTry = [preferredModel];
  if (preferredModel !== "gemini-2.0-flash") {
    modelsToTry.push("gemini-2.0-flash");
  }

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch {
      // Fall through to next model in cascade
    }
  }

  return null;
}

export function createFallbackBriefing(tweetText: string, pillar: string): PostBriefing {
  const dayOfWeek = new Date().getDay();
  const theme = PILLAR_SCHEDULE[dayOfWeek]?.theme || "Enterprise Platform & AI Architecture";

  return {
    tweet: tweetText,
    concept: `Key engineering focus on ${pillar}: ${theme}`,
    whyItMatters:
      "Implementing production-grade patterns early prevents drift, mitigates downstream incidents, and establishes reliable architecture guardrails.",
    example: {
      language: "yaml",
      description: "Architecture verification step in GitHub Actions CI",
      code: `- name: Architecture Guardrail Check\n  run: |\n    echo "Verifying landing zone compliance and zero-drift policy..."`,
    },
    talkingPoints: [
      "Focus on how automation reduces cognitive load for engineering teams.",
      "Highlight the balance between developer velocity and enterprise compliance.",
    ],
  };
}

export async function generateBriefingForExistingPost(
  tweetText: string,
  pillar: string,
): Promise<PostBriefing> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return createFallbackBriefing(tweetText, pillar);
  }

  const prompt = `You are a Principal Cloud, Platform, and AI Systems Architect.
Here is a technical tweet being published by Apurv Singhal (@apurvsinghal28):
"${tweetText}"
Topic Pillar: "${pillar}"

Generate an educational technical briefing and a concrete code example that explains this concept to the author.
Return a strict JSON object with this exact structure:
{
  "concept": "2-3 sentences explaining the core architectural concept clearly and simply.",
  "whyItMatters": "2-3 sentences on why enterprise systems or startups need this in production.",
  "example": {
    "language": "bicep | terraform | python | typescript | yaml | bash",
    "description": "1 sentence describing what this code demonstrates.",
    "code": "A realistic, working 6-15 line snippet implementing or demonstrating the concept."
  },
  "talkingPoints": [
    "If someone asks X, answer Y...",
    "Key architectural nuance to keep in mind..."
  ]
}`;

  try {
    const rawJson = await callGeminiApi(prompt, geminiKey);
    if (rawJson) {
      const parsed = JSON.parse(rawJson) as PostBriefing;
      if (parsed.concept && parsed.example?.code) {
        parsed.tweet = tweetText;
        return parsed;
      }
    }
  } catch {
    // Fall back to structured fallback
  }

  return createFallbackBriefing(tweetText, pillar);
}

export async function generateDailyPost(
  customTopic?: string,
  historyTexts: string[] = [],
): Promise<{ text: string; pillar: string; source: "ai" | "curated"; briefing?: PostBriefing }> {
  const dayOfWeek = new Date().getDay();
  const pillarConfig = PILLAR_SCHEDULE[dayOfWeek] || PILLAR_SCHEDULE[1];
  const targetPillar = customTopic || pillarConfig.pillar;

  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    const prompt = `You are Apurv Singhal, a hands-on Cloud, Platform, and AI systems engineer with 7-8 years of experience shipping production systems in Melbourne, Australia. Founder of ADM Guard.
You write like a curious, practical builder in the trenches who loves testing new tools, learning in public, and sharing what actually works.
You are NOT a lecturing corporate theorist. You are relatable, humble, and eager to implement and experiment.

Generate a single authentic, high-signal technical tweet for @apurvsinghal28 along with an educational technical briefing and concrete code example.

Topic Pillar: "${targetPillar}"
Context: ${pillarConfig.theme}
Previously posted topics to avoid repeating: ${historyTexts.slice(-10).join(" | ")}

Return a strict JSON object with this exact structure:
{
  "tweet": "The raw tweet text strictly between 60 and 250 characters total with 1 hashtag at the end (${pillarConfig.hashtags.split(" ")[0]})",
  "concept": "2-3 sentences explaining the core architectural concept clearly and simply.",
  "whyItMatters": "2-3 sentences on why enterprise systems or startups need this in production.",
  "example": {
    "language": "bicep | terraform | python | typescript | yaml | bash",
    "description": "1 sentence describing what this code demonstrates.",
    "code": "A realistic, working 6-15 line snippet implementing or demonstrating the concept."
  },
  "talkingPoints": [
    "If someone asks X, answer Y...",
    "Key architectural nuance to keep in mind..."
  ]
}

Rules for the tweet:
1. Max length: 250 characters total (strict limit to leave ample breathing room).
2. Format for high dwell time: Use clean line breaks between thoughts. NEVER write a dense wall of text.
3. Structure:
   - Line 1: Strong, contrarian, or curiosity-inducing hook (stop the scroll).
   - Middle: Concrete practitioner reality (e.g. Terraform blast radius, Bicep drift, OAIC compliance, RAG chunking).
   - Ending: An engaging question or conversation starter to spark replies (replies are the highest-weighted signal in X's algorithm).
4. Tone: Practical builder sharing lessons from shipping. No preaching, no buzzword stuffing.
5. NEVER mention any employer names, company names, enterprise client names, or specific non-profit names. Keep all references completely generic.
6. Exactly 1 clean hashtag at the end: ${pillarConfig.hashtags.split(" ")[0]}.`;

    try {
      const rawJson = await callGeminiApi(prompt, geminiKey);
      if (rawJson) {
        const parsed = JSON.parse(rawJson) as PostBriefing;
        if (parsed.tweet) {
          const sanitizedTweet = sanitizeGeneratedText(parsed.tweet);
          if (sanitizedTweet.length >= 30 && sanitizedTweet.length <= 280) {
            parsed.tweet = sanitizedTweet;
            return {
              text: sanitizedTweet,
              pillar: targetPillar,
              source: "ai",
              briefing: parsed,
            };
          }
        }
      }
    } catch {
      // Fall through to curated bank on network/API failure
    }
  }

  // Fallback: Pick an unused evergreen post from the bank
  const candidates = EVERGREEN_TOPIC_BANK[targetPillar] || EVERGREEN_TOPIC_BANK["Azure Cloud & DevOps"];
  const unused = candidates.filter((item) => !historyTexts.some((h) => h.includes(item.slice(0, 30))));
  const chosen = unused.length > 0 ? unused[0] : candidates[Math.floor(Math.random() * candidates.length)];
  const sanitizedText = sanitizeGeneratedText(chosen);

  return {
    text: sanitizedText,
    pillar: targetPillar,
    source: "curated",
    briefing: createFallbackBriefing(sanitizedText, targetPillar),
  };
}
