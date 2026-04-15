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

  it("returns 400 when required fields are invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "", message: "" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toMatch(/valid name, email, and message/i);
  });

  it("returns 400 when email format is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "not-an-email",
        message: "hello",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    vi.mocked(insertContactMessage).mockResolvedValue();

    const makeRequest = () =>
      POST(
        new NextRequest("http://localhost:3000/api/contact", {
          method: "POST",
          body: JSON.stringify({
            name: "Test",
            email: "test@example.com",
            message: "hello",
          }),
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.10",
          },
        }),
      );

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await makeRequest();
      expect(response.status).toBe(200);
    }

    const limitedResponse = await makeRequest();
    expect(limitedResponse.status).toBe(429);
  });

  it("does not rate limit when client IP is unavailable", async () => {
    vi.mocked(insertContactMessage).mockResolvedValue();

    const makeRequest = () =>
      POST(
        new NextRequest("http://localhost:3000/api/contact", {
          method: "POST",
          body: JSON.stringify({
            name: "Test",
            email: "test@example.com",
            message: "hello",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

    for (let attempt = 0; attempt < 7; attempt += 1) {
      const response = await makeRequest();
      expect(response.status).toBe(200);
    }
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
