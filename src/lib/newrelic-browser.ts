"use client";

type BrowserEventAttributes = Record<
  string,
  string | number | boolean | null | undefined
>;

let browserAgentPromise: Promise<Window["newrelic"] | undefined> | null = null;

function getBrowserDefaults(): BrowserEventAttributes {
  return {
    applicationName:
      process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_APP_NAME ||
      process.env.NEXT_PUBLIC_NEW_RELIC_APP_NAME ||
      "apurv-personal-website-browser",
    pathname: typeof window !== "undefined" ? window.location.pathname : "unknown",
  };
}

function getBrowserAgentOptions() {
  if (process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_ENABLED !== "true") {
    return null;
  }

  const applicationID = process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_APPLICATION_ID;
  const browserKey = process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_KEY;
  const accountID = process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_ACCOUNT_ID;
  const agentID = process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_AGENT_ID;

  if (!applicationID || !browserKey || !accountID || !agentID) {
    return null;
  }

  const region = process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_REGION || "eu";
  const defaultBeacon =
    region === "eu" ? "bam.eu01.nr-data.net" : "bam.nr-data.net";
  const trustKey =
    process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_TRUST_KEY || accountID;

  return {
    info: {
      applicationID,
      beacon: process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_BEACON || defaultBeacon,
      errorBeacon:
        process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_ERROR_BEACON || defaultBeacon,
      licenseKey: browserKey,
      sa: 1,
    },
    init: {
      ajax: { enabled: true },
      generic_events: { enabled: true },
      jserrors: { enabled: true },
      metrics: { enabled: true },
      page_action: { enabled: true },
      page_view_timing: { enabled: true },
      performance: {
        capture_marks: true,
        capture_measures: true,
        resources: { enabled: true },
      },
      session_trace: { enabled: true },
      soft_navigations: { enabled: true },
    },
    loader_config: {
      accountID,
      agentID,
      applicationID,
      licenseKey: browserKey,
      trustKey,
    },
  };
}

async function getBrowserAgent() {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (window.newrelic) {
    return window.newrelic;
  }

  if (browserAgentPromise) {
    return browserAgentPromise;
  }

  const options = getBrowserAgentOptions();

  if (!options) {
    return undefined;
  }

  window.__nrBrowserInitialized = true;
  browserAgentPromise = import("@newrelic/browser-agent/loaders/browser-agent")
    .then(({ BrowserAgent }) => {
      const browserAgent = new BrowserAgent(options);
      window.newrelic = window.newrelic || browserAgent;
      return window.newrelic;
    })
    .catch((error) => {
      console.warn("New Relic browser agent initialization skipped", { error });
      window.__nrBrowserInitialized = false;
      return undefined;
    });

  return browserAgentPromise;
}

export function initializeBrowserMonitoring() {
  void getBrowserAgent();
}

function withBrowserAgent(
  callback: (agent: NonNullable<Window["newrelic"]>) => void,
) {
  void getBrowserAgent().then((agent) => {
    if (agent) {
      callback(agent);
    }
  });
}

export function addBrowserPageAction(
  actionName: string,
  attributes: BrowserEventAttributes = {},
) {
  withBrowserAgent((agent) => {
    agent.addPageAction?.(actionName, {
      ...getBrowserDefaults(),
      ...attributes,
    });
  });
}

export function recordBrowserEvent(
  eventType: string,
  attributes: BrowserEventAttributes = {},
) {
  withBrowserAgent((agent) => {
    agent.recordCustomEvent?.(eventType, {
      ...getBrowserDefaults(),
      ...attributes,
    });
  });
}

export function noticeBrowserError(
  error: Error,
  attributes: BrowserEventAttributes = {},
) {
  withBrowserAgent((agent) => {
    agent.noticeError?.(error, {
      ...getBrowserDefaults(),
      ...attributes,
    });
  });
}
