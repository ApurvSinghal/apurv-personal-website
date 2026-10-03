// @vitest-environment node

import { NextRequest } from "next/server";

const mockSend = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => mockSend(...args) };
  },
}));

import { POST } from "@/app/api/contact/route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "mock" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM_EMAIL = "Portfolio <noreply@example.com>";
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

  it("returns 400 when JSON payload is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: "{not-valid-json",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toMatch(/invalid json payload/i);
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

  it("returns 503 when email delivery is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;

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

  it("returns 400 when honeypot field is populated", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "hello",
        website: "https://spam.example",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 400 when form is submitted too quickly", async () => {
    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "hello",
        formStartedAt: Date.now(),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("retries with onboarding@resend.dev when custom domain returns 403 domain error", async () => {
    mockSend
      .mockResolvedValueOnce({
        data: null,
        error: {
          statusCode: 403,
          message: "The domain example.com is not verified.",
          name: "validation_error",
        },
      })
      .mockResolvedValueOnce({
        data: { id: "fallback-id" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: "ack-id" },
        error: null,
      });

    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Hello there",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "onboarding@resend.dev",
      }),
    );
  });

  it("returns 503 when Resend returns an error and fallback also fails", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: {
        statusCode: 403,
        message: "The domain example.com is not verified.",
        name: "validation_error",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Hello there",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.error).toMatch(/temporarily unavailable/i);
  });

  it("returns 503 when Resend throws an unexpected exception", async () => {
    mockSend.mockRejectedValue(new Error("Network timeout"));

    const request = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Hello there",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json.error).toMatch(/temporarily unavailable/i);
  });
});

