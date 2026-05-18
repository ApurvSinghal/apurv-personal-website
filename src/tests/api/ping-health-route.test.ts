// @vitest-environment node

import { NextRequest } from "next/server";

import { GET } from "@/app/api/ping-health/route";

describe("GET /api/ping-health", () => {
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

    const request = new NextRequest("http://localhost:3000/api/ping-health");
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it("returns 401 in production when cron secret is missing", async () => {
    delete process.env.CRON_SECRET;
    process.env = { ...process.env, NODE_ENV: "production" };

    const request = new NextRequest("http://localhost:3000/api/ping-health");
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it("returns 200 when bearer token matches", async () => {
    process.env.CRON_SECRET = "secret";

    const request = new NextRequest("http://localhost:3000/api/ping-health", {
      headers: {
        authorization: "Bearer secret",
      },
    });
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("returns 401 when only query secret is sent", async () => {
    process.env.CRON_SECRET = "secret";

    const request = new NextRequest(
      "http://localhost:3000/api/ping-health?secret=secret",
    );
    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
