// @vitest-environment node

import { NextRequest } from "next/server";

vi.mock("@/lib/supabase", () => ({
  insertContactMessage: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn().mockResolvedValue({ id: "mock" }) };
  },
}));

import { POST } from "@/app/api/contact/route";
import { insertContactMessage } from "@/lib/supabase";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "", message: "" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("All fields are required");
  });

  it("returns 503 when Supabase write fails", async () => {
    vi.mocked(insertContactMessage).mockRejectedValueOnce(
      new Error("Unauthorized"),
    );

    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "hello",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.error).toMatch(/temporarily unavailable/i);
  });

  it("returns 200 on successful submission", async () => {
    vi.mocked(insertContactMessage).mockResolvedValueOnce();

    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "hello",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe("Message sent successfully");
  });
});
