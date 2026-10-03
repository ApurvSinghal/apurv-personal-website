/**
 * Application Insights Server-Side Telemetry Dispatcher
 * Dispatches structured exceptions and custom events to Azure Application Insights.
 */

export async function recordServerError(
  error: unknown,
  customAttributes?: Record<string, string | number | boolean>,
) {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  ) {
    try {
      const appInsights = await import("applicationinsights");
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackException({
          exception: error instanceof Error ? error : new Error(String(error)),
          properties: customAttributes,
        });
      }
    } catch {
      // Fail silently if Application Insights fails to record
    }
  }
}

export async function recordServerEvent(
  name: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  ) {
    try {
      const appInsights = await import("applicationinsights");
      if (appInsights.defaultClient) {
        appInsights.defaultClient.trackEvent({
          name,
          properties,
        });
      }
    } catch {
      // Fail silently if Application Insights fails to record
    }
  }
}
