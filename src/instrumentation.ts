export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      try {
        const appInsights = await import('applicationinsights');
        if (!appInsights.defaultClient) {
          appInsights
            .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true, true)
            .setUseDiskRetryCaching(true)
            .setSendLiveMetrics(true)
            .start();
        }
      } catch {
        // Silently skip if Application Insights cannot be initialized
      }
    }

    if (process.env.NEW_RELIC_LICENSE_KEY) {
      if (!process.env.NEW_RELIC_LOG) {
        process.env.NEW_RELIC_LOG = 'stdout';
      }
      if (!process.env.NEW_RELIC_NO_CONFIG_FILE) {
        process.env.NEW_RELIC_NO_CONFIG_FILE = 'true';
      }
      await import('newrelic');
    }
  }
}

