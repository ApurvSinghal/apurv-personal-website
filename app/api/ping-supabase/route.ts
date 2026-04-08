import { NextRequest, NextResponse } from "next/server";
import { flushNewRelic } from "@/lib/newrelic";
import { pingSupabase } from "@/lib/supabase";

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${configuredSecret}`;
}

export async function GET(request: NextRequest) {
  const checkedAt = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  if (!isAuthorized(request)) {
    console.warn("Supabase ping unauthorized", { checkedAt, userAgent });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await pingSupabase();
    console.info("Supabase ping succeeded", { checkedAt, userAgent });
    await flushNewRelic();
    return NextResponse.json({ ok: true, checkedAt }, { status: 200 });
  } catch (error) {
    console.error("Supabase ping failed", { checkedAt, userAgent, error });
    await flushNewRelic();
    return NextResponse.json({ ok: false, checkedAt }, { status: 503 });
  }
}
