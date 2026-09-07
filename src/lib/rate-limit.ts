const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;

const contactRequestCounts = new Map<
  string,
  { count: number; windowStart: number }
>();

export type RateLimitDecision = {
  currentCount: number;
  limited: boolean;
  source: "memory" | "skipped";
};

export async function getContactRateLimitDecision(
  ip: string,
): Promise<RateLimitDecision> {
  if (ip === "unknown") {
    return {
      currentCount: 0,
      limited: false,
      source: "skipped",
    };
  }

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

  // Prune expired entries if the map grows
  if (contactRequestCounts.size > 500) {
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
