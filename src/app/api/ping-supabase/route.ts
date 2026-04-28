import { NextRequest, NextResponse } from "next/server";
import {
  flushNewRelic,
  getDurationMs,
  getErrorAttributes,
  recordNewRelicEvent,
  addTransactionAttributes,
  noticeServerError,
} from "@/lib/newrelic";
import { pingSupabase } from "@/lib/supabase";

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const secretParam = request.nextUrl.searchParams.get("secret");
  return secretParam === configuredSecret;
}

export async function GET(request: NextRequest) {
  const requestStartedAtMs = Date.now();
  const checkedAt = new Date().toISOString();
  const requestPath = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  if (!isAuthorized(request)) {
    console.warn("Supabase ping unauthorized", { checkedAt, userAgent });
    await addTransactionAttributes({ pingStatus: "unauthorized" });
    await recordNewRelicEvent("PingHealthEvent", {
      checkedAt,
      requestPath,
      status: "unauthorized",
      totalDurationMs: getDurationMs(requestStartedAtMs),
      userAgent,
    });
    await flushNewRelic();
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseStartedAtMs = Date.now();
    await pingSupabase();
    const supabaseDurationMs = getDurationMs(supabaseStartedAtMs);
    console.info("Supabase ping succeeded", { checkedAt, supabaseDurationMs, userAgent });
    await addTransactionAttributes({ pingStatus: "success", supabaseDurationMs });
    await recordNewRelicEvent("PingHealthEvent", {
      checkedAt,
      requestPath,
      status: "success",
      supabaseDurationMs,
      totalDurationMs: getDurationMs(requestStartedAtMs),
      userAgent,
    });
    await flushNewRelic();
    return NextResponse.json({ ok: true, checkedAt }, { status: 200 });
  } catch (error) {
    console.error("Supabase ping failed", {
      checkedAt,
      userAgent,
      error: error instanceof Error ? error.message : String(error),
    });
    await addTransactionAttributes({ pingStatus: "failure" });
    await noticeServerError(error, { stage: "ping_supabase_failed", requestPath });
    await recordNewRelicEvent("PingHealthEvent", {
      checkedAt,
      requestPath,
      status: "failure",
      totalDurationMs: getDurationMs(requestStartedAtMs),
      userAgent,
      ...getErrorAttributes(error),
    });
    await flushNewRelic();
    return NextResponse.json({ ok: false, checkedAt }, { status: 503 });
  }
}
