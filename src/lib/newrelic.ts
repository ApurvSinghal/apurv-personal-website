export async function flushNewRelic(timeoutMs = 2000) {
  if (process.env.NEW_RELIC_ENABLED !== "true") {
    return;
  }

  try {
    const newrelic = await import("newrelic");

    if (typeof newrelic.agent?.forceHarvestAll !== "function") {
      return;
    }

    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);

      newrelic.agent.forceHarvestAll(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  } catch (error) {
    console.warn("New Relic flush skipped", { error });
  }
}

type CustomEventAttributes = Record<string, string | number | boolean | null | undefined>;

function getBaseEventAttributes() {
  return {
    applicationName: process.env.NEW_RELIC_APP_NAME || "apurv-personal-website",
    deploymentEnvironment:
      process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    runtime: "nodejs",
  } satisfies CustomEventAttributes;
}

export function getDurationMs(startTimeMs: number) {
  return Date.now() - startTimeMs;
}

export function getErrorAttributes(error: unknown): CustomEventAttributes {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message.slice(0, 500),
    };
  }

  return {
    errorName: "UnknownError",
    errorMessage: String(error).slice(0, 500),
  };
}

export async function recordNewRelicEvent(
  eventType: string,
  attributes: CustomEventAttributes,
) {
  if (process.env.NEW_RELIC_ENABLED !== "true") {
    return;
  }

  try {
    const newrelic = await import("newrelic");

    if (typeof newrelic.recordCustomEvent !== "function") {
      return;
    }

    newrelic.recordCustomEvent(eventType, {
      ...getBaseEventAttributes(),
      ...attributes,
    });
  } catch (error) {
    console.warn("New Relic custom event skipped", { eventType, error });
  }
}

export async function addTransactionAttributes(
  attributes: CustomEventAttributes,
) {
  if (process.env.NEW_RELIC_ENABLED !== "true") {
    return;
  }

  try {
    const newrelic = await import("newrelic");

    for (const [key, value] of Object.entries(attributes)) {
      if (value !== null && value !== undefined) {
        newrelic.addCustomAttribute?.(key, value);
      }
    }
  } catch {
    // Silently skip — transaction attribute enrichment is best-effort
  }
}

export async function noticeServerError(
  error: unknown,
  attributes: CustomEventAttributes = {},
) {
  if (process.env.NEW_RELIC_ENABLED !== "true") {
    return;
  }

  try {
    const newrelic = await import("newrelic");
    const err = error instanceof Error ? error : new Error(String(error));
    newrelic.noticeError?.(err, { ...getBaseEventAttributes(), ...attributes });
  } catch {
    // Silently skip
  }
}
