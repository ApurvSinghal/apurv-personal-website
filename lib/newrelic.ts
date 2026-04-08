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

    newrelic.recordCustomEvent(eventType, attributes);
  } catch (error) {
    console.warn("New Relic custom event skipped", { eventType, error });
  }
}
