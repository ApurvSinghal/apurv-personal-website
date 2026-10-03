/**
 * Safely records a server-side error to New Relic if configured.
 */
export async function recordServerError(
  error: unknown,
  customAttributes?: Record<string, string | number | boolean>,
): Promise<void> {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEW_RELIC_LICENSE_KEY
  ) {
    try {
      const newrelic = await import("newrelic");
      const err = error instanceof Error ? error : new Error(String(error));
      const nr = newrelic as unknown as {
        default?: {
          noticeError?: (
            err: Error,
            attrs?: Record<string, string | number | boolean>,
          ) => void;
        };
        noticeError?: (
          err: Error,
          attrs?: Record<string, string | number | boolean>,
        ) => void;
      };
      const record = nr.default?.noticeError ?? nr.noticeError;
      if (typeof record === "function") {
        record(err, customAttributes);
      }
    } catch {
      // Fail silently if New Relic is unavailable or fails to record
    }
  }
}
