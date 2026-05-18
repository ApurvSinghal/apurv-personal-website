import { NextRequest, NextResponse } from "next/server";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const bearerToken = getBearerToken(request);
  return bearerToken === configuredSecret;
}

export async function GET(request: NextRequest) {
  const checkedAt = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  if (!isAuthorized(request)) {
    console.warn("Healthcheck ping unauthorized", { checkedAt, userAgent });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.info("Healthcheck ping succeeded", {
    checkedAt,
    userAgent,
  });
  return NextResponse.json({ ok: true, checkedAt }, { status: 200 });
}
