// @vitest-environment node

import { insertContactMessage, pingSupabase } from "@/lib/supabase";

describe("supabase helpers", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("posts contact messages to Supabase REST", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 201 }),
    );

    await insertContactMessage({
      name: "Test",
      email: "test@example.com",
      message: "Hello",
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0] as [URL, RequestInit];
    expect(String(url)).toBe("https://example.supabase.co/rest/v1/contact_messages");
    expect(options.method).toBe("POST");
  });

  it("pings Supabase with a lightweight read", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    await pingSupabase();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0] as [URL, RequestInit];
    expect(String(url)).toContain("/rest/v1/contact_messages");
    expect(String(url)).toContain("select=id");
    expect(options.method).toBe("GET");
  });
});