// @vitest-environment node

import { NextRequest } from "next/server";

vi.mock("@/lib/supabase", () => ({
  pingSupabase: vi.fn(),
}));

import { GET } from "@/app/api/ping-supabase/route";
import { pingSupabase } from "@/lib/supabase";

describe("GET /api/ping-supabase", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 401 when cron secret is configured and missing", async () => {
    process.env.CRON_SECRET = "secret";

    const request = new NextRequest("http://localhost:3000/api/ping-supabase");
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it("returns 401 in production when cron secret is missing", async () => {
    delete process.env.CRON_SECRET;
    process.env = { ...process.env, NODE_ENV: "production" };

    const request = new NextRequest("http://localhost:3000/api/ping-supabase");
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it("returns 200 when ping succeeds", async () => {
    process.env.CRON_SECRET = "secret";
    vi.mocked(pingSupabase).mockResolvedValueOnce();

    const request = new NextRequest("http://localhost:3000/api/ping-supabase", {
      headers: {
        authorization: "Bearer secret",
      },
    });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
  });
});
