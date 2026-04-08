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