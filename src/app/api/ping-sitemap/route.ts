import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sitemapUrl = "https://apurvsinghal.com/sitemap.xml";
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    const response = await fetch(pingUrl, { signal: AbortSignal.timeout(5000) });

    console.info("Sitemap ping completed", {
      status: response.status,
      sitemapUrl,
      checkedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      status: response.status,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sitemap ping failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
