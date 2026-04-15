const accountId = Number(process.env.NEW_RELIC_ACCOUNT_ID || 0);
const apiKey = process.env.NEW_RELIC_USER_API_KEY;
const appName = process.env.NEW_RELIC_APP_NAME || "apurv-personal-website";
const browserAppName =
  process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_APP_NAME || `${appName}-browser`;
const region = process.env.NEW_RELIC_REGION || "eu";
const runbookUrl =
  process.env.NEW_RELIC_ALERT_RUNBOOK_URL ||
  "https://github.com/ApurvSinghal/apurv-personal-website/blob/main/README.md";

if (!accountId || !apiKey) {
  console.error(
    "Missing NEW_RELIC_ACCOUNT_ID or NEW_RELIC_USER_API_KEY for alert provisioning.",
  );
  process.exit(1);
}

const graphQlUrl =
  region === "eu" ? "https://api.eu.newrelic.com/graphql" : "https://api.newrelic.com/graphql";

function enumValue(value) {
  return { __raw: value };
}

function toGraphQlValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => toGraphQlValue(item)).join(", ")}]`;
  }

  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "boolean":
    case "number":
      return String(value);
    case "string":
      return JSON.stringify(value);
    case "object":
      if (value.__raw) {
        return value.__raw;
      }

      return `{ ${Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => `${key}: ${toGraphQlValue(item)}`)
        .join(", ")} }`;
    default:
      throw new Error(`Unsupported GraphQL value type: ${typeof value}`);
  }
}

async function nerdGraphRequest(query) {
  const response = await fetch(graphQlUrl, {
    method: "POST",
    headers: {
      "API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    throw new Error(JSON.stringify(payload.errors || payload, null, 2));
  }

  return payload.data;
}

async function findPolicyByName(name) {
  const data = await nerdGraphRequest(`
    {
      actor {
        account(id: ${accountId}) {
          alerts {
            policiesSearch(searchCriteria: { name: ${JSON.stringify(name)} }) {
              policies {
                id
                name
              }
            }
          }
        }
      }
    }
  `);

  return (
    data.actor.account.alerts.policiesSearch.policies.find(
      (policy) => policy.name === name,
    ) || null
  );
}

async function ensurePolicy(name) {
  const existingPolicy = await findPolicyByName(name);

  if (existingPolicy) {
    return existingPolicy;
  }

  const data = await nerdGraphRequest(`
    mutation {
      alertsPolicyCreate(
        accountId: ${accountId}
        policy: { name: ${JSON.stringify(name)}, incidentPreference: PER_CONDITION }
      ) {
        id
        name
      }
    }
  `);

  return data.alertsPolicyCreate;
}

async function getExistingConditions(policyId) {
  const data = await nerdGraphRequest(`
    {
      actor {
        account(id: ${accountId}) {
          alerts {
            nrqlConditionsSearch(searchCriteria: { policyId: ${policyId} }) {
              nrqlConditions {
                id
                name
                type
              }
            }
          }
        }
      }
    }
  `);

  return data.actor.account.alerts.nrqlConditionsSearch.nrqlConditions;
}

async function upsertStaticCondition(policyId, existingCondition, condition) {
  const mutationName = existingCondition
    ? "alertsNrqlConditionStaticUpdate"
    : "alertsNrqlConditionStaticCreate";
  const args = existingCondition
    ? `accountId: ${accountId}, id: ${JSON.stringify(existingCondition.id)}, condition: ${toGraphQlValue(condition)}`
    : `accountId: ${accountId}, policyId: ${policyId}, condition: ${toGraphQlValue(condition)}`;

  const data = await nerdGraphRequest(`
    mutation {
      ${mutationName}(
        ${args}
      ) {
        id
        name
      }
    }
  `);

  return data[mutationName];
}

// ---------------------------------------------------------------------------
// Policy: Ops — custom event alerts (contact flow, ping, rate limiting, browser)
// ---------------------------------------------------------------------------
const opsConditions = [
  {
    name: "Contact API failures",
    nrql: {
      query: `SELECT filter(count(*), WHERE stage IN ('supabase_insert_failed', 'response_error')) FROM ContactFlowEvent WHERE applicationName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Contact API latency",
    nrql: {
      query: `SELECT average(totalDurationMs) FROM ContactFlowEvent WHERE applicationName = '${appName}' AND stage = 'response_success'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 2500,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Ping route failures",
    nrql: {
      query: `SELECT filter(count(*), WHERE status IN ('failure', 'unauthorized')) FROM PingHealthEvent WHERE applicationName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Contact rate limiting spike",
    nrql: {
      query: `SELECT filter(count(*), WHERE stage = 'rate_limited') FROM ContactFlowEvent WHERE applicationName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("WARNING"),
        threshold: 3,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Browser JS error rate spike",
    nrql: {
      query: `SELECT count(*) FROM JavaScriptError WHERE appName = '${browserAppName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 10,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Synthetic homepage failure",
    nrql: {
      query: `SELECT filter(count(*), WHERE result = 'FAILED') FROM SyntheticCheck WHERE monitorName = 'apurv-personal-website Homepage Ping'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
];

// ---------------------------------------------------------------------------
// Policy: Alerts — high-level APM alerts
// ---------------------------------------------------------------------------
const alertsConditions = [
  {
    name: "Ping Endpoint Failures > 0 (5m)",
    nrql: {
      query: `SELECT filter(count(*), WHERE status IN ('failure', 'unauthorized')) FROM PingHealthEvent WHERE applicationName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "High Error Count > 5 (5m)",
    nrql: {
      query: `SELECT count(apm.service.error.count) FROM Metric WHERE appName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 5,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("AT_LEAST_ONCE"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "APM Apdex drop",
    nrql: {
      query: `SELECT apdex(apm.service.apdex) FROM Metric WHERE appName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("BELOW"),
        priority: enumValue("CRITICAL"),
        threshold: 0.7,
        thresholdDuration: 600,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
];

// ---------------------------------------------------------------------------
// Policy: Performance Coverage — web vitals + throughput + server perf
// ---------------------------------------------------------------------------
const performanceConditions = [
  {
    name: "High Error Rate (>5%)",
    nrql: {
      query: `SELECT percentage(count(*), WHERE error IS true) FROM Transaction WHERE appName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 5,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "High p95 Response Time (>800ms)",
    nrql: {
      query: `SELECT percentile(duration, 95) FROM Transaction WHERE appName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 300,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0.8,
        thresholdDuration: 300,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Low Throughput (<10 rpm)",
    nrql: {
      query: `SELECT rate(count(*), 1 minute) FROM Transaction WHERE appName = '${appName}'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("BELOW"),
        priority: enumValue("WARNING"),
        threshold: 10,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Browser LCP degradation",
    nrql: {
      query: `SELECT percentile(metricValue, 75) FROM WebVitalEvent WHERE applicationName = '${browserAppName}' AND metricName = 'LCP'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 4000,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Browser INP degradation",
    nrql: {
      query: `SELECT percentile(metricValue, 75) FROM WebVitalEvent WHERE applicationName = '${browserAppName}' AND metricName = 'INP'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 200,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
  {
    name: "Browser CLS degradation",
    nrql: {
      query: `SELECT percentile(metricValue, 75) FROM WebVitalEvent WHERE applicationName = '${browserAppName}' AND metricName = 'CLS'`,
    },
    signal: {
      aggregationDelay: 120,
      aggregationMethod: enumValue("EVENT_FLOW"),
      aggregationWindow: 900,
    },
    terms: [
      {
        operator: enumValue("ABOVE"),
        priority: enumValue("CRITICAL"),
        threshold: 0.1,
        thresholdDuration: 900,
        thresholdOccurrences: enumValue("ALL"),
      },
    ],
    runbookUrl,
    valueFunction: enumValue("SINGLE_VALUE"),
    violationTimeLimitSeconds: 86400,
  },
];

// ---------------------------------------------------------------------------
// Sync all policies
// ---------------------------------------------------------------------------
const policies = [
  { name: `${appName} Ops`, conditions: opsConditions },
  { name: `${appName} Alerts`, conditions: alertsConditions },
  { name: `${appName} Performance Coverage`, conditions: performanceConditions },
];

for (const { name: policyName, conditions } of policies) {
  const policy = await ensurePolicy(policyName);
  const existingConditions = await getExistingConditions(policy.id);

  for (const condition of conditions) {
    const existingCondition = existingConditions.find(
      (item) => item.name === condition.name,
    );

    const result = await upsertStaticCondition(policy.id, existingCondition, {
      ...condition,
      enabled: true,
    });

    console.log(
      `  ${existingCondition ? "Updated" : "Created"} condition: ${result.name}`,
    );
  }

  console.log(`Alert policy ready: ${policyName} (${policy.id})`);
}
