import crypto from "node:crypto";

export interface XClientCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

export function generateOAuth1Header(
  method: string,
  url: string,
  creds: XClientCredentials,
  customNonce?: string,
  customTimestamp?: string,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: customNonce || crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: customTimestamp || Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };

  // Sort parameters alphabetically by key
  const sortedKeys = Object.keys(oauthParams).sort();
  const paramString = sortedKeys
    .map((key) => `${percentEncode(key)}=${percentEncode(oauthParams[key])}`)
    .join("&");

  // Create Signature Base String
  const signatureBase = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;

  // Create Signing Key: consumer_secret&token_secret
  const signingKey = `${percentEncode(creds.apiSecret)}&${percentEncode(creds.accessTokenSecret)}`;

  // Calculate HMAC-SHA1 signature
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  // Build Authorization header string
  const authHeaderParts = Object.keys(oauthParams)
    .sort()
    .map((key) => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`);

  return `OAuth ${authHeaderParts.join(", ")}`;
}

export interface PostTweetResult {
  id: string;
  text: string;
}

export async function postTweetToX(
  text: string,
  creds?: XClientCredentials,
): Promise<PostTweetResult> {
  const credentials: XClientCredentials = creds || {
    apiKey: process.env.X_API_KEY || "",
    apiSecret: process.env.X_API_SECRET || "",
    accessToken: process.env.X_ACCESS_TOKEN || "",
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || "",
  };

  if (
    !credentials.apiKey ||
    !credentials.apiSecret ||
    !credentials.accessToken ||
    !credentials.accessTokenSecret
  ) {
    throw new Error(
      "Missing required X credentials (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)",
    );
  }

  const endpoint = "https://api.twitter.com/2/tweets";
  const authHeader = generateOAuth1Header("POST", endpoint, credentials);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    if (res.status === 402) {
      throw new Error(
        `X API error HTTP 402 (Payment Required / Credits Depleted): Your X Developer account has $0.00 credits balance. As of 2025/2026, X API v2 operates on a pay-as-you-go credit system ($0.015 per post). Please visit https://console.x.com/ and add a small prepaid balance ($5) under Billing -> Credits to enable automated posting. Raw response: ${errorBody}`,
      );
    }
    if (res.status === 403) {
      throw new Error(
        `X API error HTTP 403 (Forbidden / Duplicate Status): The request was rejected by X. This usually occurs if the exact same tweet was posted recently, or if the Developer App lacks Write permissions. Raw response: ${errorBody}`,
      );
    }
    throw new Error(`X API error HTTP ${res.status}: ${errorBody}`);
  }

  const data = (await res.json()) as { data: { id: string; text: string } };
  return {
    id: data.data.id,
    text: data.data.text,
  };
}
