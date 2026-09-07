import { describe, it, expect } from "vitest";
import {
  generateDailyPost,
  sanitizeGeneratedText,
  createFallbackBriefing,
  PILLAR_SCHEDULE,
  EVERGREEN_TOPIC_BANK,
} from "../../../scripts/x-poster/generator";
import { generateOAuth1Header, percentEncode } from "../../../scripts/x-poster/x-client";
import { buildBriefingEmailHtml } from "../../../scripts/x-poster/notifier";

describe("X Poster Automation Engine", () => {
  describe("OAuth 1.0a Client", () => {
    it("encodes characters according to RFC 3986", () => {
      expect(percentEncode("hello world")).toBe("hello%20world");
      expect(percentEncode("a!b*c'd(e)f")).toBe("a%21b%2Ac%27d%28e%29f");
    });

    it("generates a valid OAuth 1.0a header", () => {
      const creds = {
        apiKey: "test_api_key",
        apiSecret: "test_api_secret",
        accessToken: "test_access_token",
        accessTokenSecret: "test_token_secret",
      };

      const header = generateOAuth1Header(
        "POST",
        "https://api.twitter.com/2/tweets",
        creds,
        "test_nonce_12345",
        "1725580800",
      );

      expect(header).toContain('OAuth oauth_consumer_key="test_api_key"');
      expect(header).toContain('oauth_nonce="test_nonce_12345"');
      expect(header).toContain('oauth_signature_method="HMAC-SHA1"');
      expect(header).toContain('oauth_timestamp="1725580800"');
      expect(header).toContain('oauth_token="test_access_token"');
      expect(header).toContain('oauth_version="1.0"');
      expect(header).toContain("oauth_signature=");
    });
  });

  describe("Text Sanitization Pipeline", () => {
    it("strips standard and typographic quotation marks", () => {
      expect(sanitizeGeneratedText('"Designing for failure first."')).toBe(
        "Designing for failure first.",
      );
      expect(sanitizeGeneratedText('“Zero-PII architecture is critical.”')).toBe(
        "Zero-PII architecture is critical.",
      );
      expect(sanitizeGeneratedText("'Single quotes wrapped.'")).toBe(
        "Single quotes wrapped.",
      );
    });

    it("strips conversational LLM intros", () => {
      expect(
        sanitizeGeneratedText("Here is a tweet: Cloud landing zones save months of rework. #Azure"),
      ).toBe("Cloud landing zones save months of rework. #Azure");
      expect(
        sanitizeGeneratedText("Here's a thought: Prompt caching cuts latency by 70%."),
      ).toBe("Prompt caching cuts latency by 70%.");
      expect(
        sanitizeGeneratedText('Here is a post: "Immutable WORM storage ensures compliance."'),
      ).toBe("Immutable WORM storage ensures compliance.");
    });

    it("strips markdown code blocks and normalizes excessive whitespace", () => {
      expect(
        sanitizeGeneratedText("```\nAutomate policy guardrails with Terraform.\n```"),
      ).toBe("Automate policy guardrails with Terraform.");
      expect(
        sanitizeGeneratedText("First paragraph.\n\n\n\nSecond paragraph."),
      ).toBe("First paragraph.\n\nSecond paragraph.");
    });
  });

  describe("Technical Briefing & Email Dispatch", () => {
    it("creates a well-structured fallback briefing for any post", () => {
      const briefing = createFallbackBriefing("Test tweet content", "Azure Cloud & DevOps");
      expect(briefing.tweet).toBe("Test tweet content");
      expect(briefing.concept).toBeTruthy();
      expect(briefing.whyItMatters).toBeTruthy();
      expect(briefing.example.code).toBeTruthy();
      expect(briefing.talkingPoints.length).toBeGreaterThan(0);
    });

    it("renders rich HTML email containing tweet, concept, code, and talking points", () => {
      const briefing = createFallbackBriefing(
        "Shift-left architecture testing saves weeks of rework. #DevOps",
        "Azure Cloud & DevOps",
      );
      const html = buildBriefingEmailHtml({
        tweetId: "1234567890",
        tweetText: "Shift-left architecture testing saves weeks of rework. #DevOps",
        pillar: "Azure Cloud & DevOps",
        source: "queue",
        briefing,
        isDryRun: false,
      });

      expect(html).toContain("Daily Technical Briefing");
      expect(html).toContain("Azure Cloud &amp; DevOps");
      expect(html).toContain("Shift-left architecture testing");
      expect(html).toContain("1234567890");
      expect(html).toContain("Architecture Guardrail Check");
    });
  });

  describe("Content Generation & Pillars", () => {
    it("has complete schedule defined for all 7 days of week", () => {
      for (let day = 0; day <= 6; day++) {
        expect(PILLAR_SCHEDULE[day]).toBeDefined();
        expect(PILLAR_SCHEDULE[day].pillar).toBeTruthy();
        expect(PILLAR_SCHEDULE[day].theme).toBeTruthy();
        expect(PILLAR_SCHEDULE[day].hashtags).toBeTruthy();
      }
    });

    it("has evergreen posts for all pillars that are strictly <= 280 chars", () => {
      for (const [pillar, posts] of Object.entries(EVERGREEN_TOPIC_BANK)) {
        expect(posts.length).toBeGreaterThanOrEqual(1);
        for (const post of posts) {
          expect(
            post.length,
            `Post in pillar '${pillar}' exceeds 280 chars (${post.length} chars)`,
          ).toBeLessThanOrEqual(280);
          expect(post.length).toBeGreaterThanOrEqual(30);
        }
      }
    });

    it("generates a valid post within character bounds", async () => {
      const result = await generateDailyPost("Applied AI & Systems", []);
      expect(result.text).toBeTruthy();
      expect(result.text.length).toBeLessThanOrEqual(280);
      expect(result.text.length).toBeGreaterThanOrEqual(30);
      expect(result.pillar).toBe("Applied AI & Systems");
    });
  });
});
