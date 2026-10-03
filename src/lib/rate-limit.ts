export type RateLimitDecision = {
  currentCount: number;
  limited: boolean;
  source: "memory" | "skipped";
};

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

// Best-effort, per-instance limiter; state resets on cold start.
export function createRateLimiter({ windowMs, maxRequests }: RateLimitOptions) {
  const requestCounts = new Map<
    string,
    { count: number; windowStart: number }
  >();

  return function check(ip: string): RateLimitDecision {
    if (!ip || ip === "unknown") {
      return { currentCount: 0, limited: false, source: "skipped" };
    }

    const now = Date.now();
    const entry = requestCounts.get(ip);

    if (!entry || now - entry.windowStart >= windowMs) {
      requestCounts.set(ip, { count: 1, windowStart: now });
      return { currentCount: 1, limited: false, source: "memory" };
    }

    entry.count += 1;

    if (requestCounts.size > 500) {
      for (const [trackedIp, trackedEntry] of requestCounts.entries()) {
        if (now - trackedEntry.windowStart >= windowMs) {
          requestCounts.delete(trackedIp);
        }
      }
    }

    return {
      currentCount: entry.count,
      limited: entry.count > maxRequests,
      source: "memory",
    };
  };
}

const checkContactRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
});

export async function getContactRateLimitDecision(
  ip: string,
): Promise<RateLimitDecision> {
  return checkContactRateLimit(ip);
}
