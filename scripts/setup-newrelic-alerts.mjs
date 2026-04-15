const accountId = Number(process.env.NEW_RELIC_ACCOUNT_ID || 0);
const apiKey = process.env.NEW_RELIC_USER_API_KEY;
const appName = process.env.NEW_RELIC_APP_NAME || "apurv-personal-website";
const policyName = process.env.NEW_RELIC_ALERT_POLICY_NAME || `${appName} Ops`;
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

const conditions = [
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
    name: "Browser LCP degradation",
    nrql: {
      query: `SELECT percentile(metricValue, 75) FROM WebVitalEvent WHERE applicationName = '${process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_APP_NAME || `${appName}-browser`}' AND metricName = 'LCP'`,
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
];

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

  console.log(`${existingCondition ? "Updated" : "Created"} alert condition: ${result.name}`);
}

console.log(`Alert policy ready: ${policy.name} (${policy.id})`);
