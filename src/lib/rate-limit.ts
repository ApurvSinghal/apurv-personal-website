const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;

const contactRequestCounts = new Map<string, { count: number; windowStart: number }>();

type RateLimitDecision = {
  currentCount: number;
  limited: boolean;
  source: "upstash" | "memory" | "skipped";
};

function runMemoryRateLimit(ip: string): RateLimitDecision {
  const now = Date.now();
  const entry = contactRequestCounts.get(ip);

  if (!entry || now - entry.windowStart >= CONTACT_RATE_LIMIT_WINDOW_MS) {
    contactRequestCounts.set(ip, { count: 1, windowStart: now });
    return {
      currentCount: 1,
      limited: false,
      source: "memory",
    };
  }

  entry.count += 1;

  if (contactRequestCounts.size > 1000) {
    for (const [trackedIp, trackedEntry] of contactRequestCounts.entries()) {
      if (now - trackedEntry.windowStart >= CONTACT_RATE_LIMIT_WINDOW_MS) {
        contactRequestCounts.delete(trackedIp);
      }
    }
  }

  return {
    currentCount: entry.count,
    limited: entry.count > CONTACT_RATE_LIMIT_MAX_REQUESTS,
    source: "memory",
  };
}

async function callUpstashCommand(
  baseUrl: string,
  token: string,
  command: string,
  ...args: Array<string | number>
) {
  const url = new URL(`${baseUrl}/${command}/${args.map((value) => encodeURIComponent(String(value))).join("/")}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Upstash ${command} failed with status ${response.status}${body ? `: ${body}` : ""}`);
  }

  return response.json() as Promise<{ result?: number | string }>;
}

async function runUpstashRateLimit(ip: string): Promise<RateLimitDecision> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not configured");
  }

  const key = `ratelimit:contact:${ip}`;
  const increment = await callUpstashCommand(baseUrl, token, "incr", key);
  const currentCount = Number(increment.result ?? 0);

  if (!Number.isFinite(currentCount) || currentCount < 1) {
    throw new Error("Upstash INCR returned an invalid count");
  }

  if (currentCount === 1) {
    await callUpstashCommand(baseUrl, token, "pexpire", key, CONTACT_RATE_LIMIT_WINDOW_MS);
  }

  return {
    currentCount,
    limited: currentCount > CONTACT_RATE_LIMIT_MAX_REQUESTS,
    source: "upstash",
  };
}

export async function getContactRateLimitDecision(ip: string): Promise<RateLimitDecision> {
  if (ip === "unknown") {
    console.info("Rate limit skipped: unknown client IP");
    return {
      currentCount: 0,
      limited: false,
      source: "skipped",
    };
  }

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await runUpstashRateLimit(ip);
    } catch (error) {
      console.warn("Upstash rate limiting failed, falling back to memory", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return runMemoryRateLimit(ip);
}
