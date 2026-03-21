import { NextRequest, NextResponse } from "next/server";
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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await pingSupabase();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Supabase ping failed:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}