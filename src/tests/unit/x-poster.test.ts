import { describe, it, expect } from "vitest";
import { generateDailyPost, PILLAR_SCHEDULE, EVERGREEN_TOPIC_BANK } from "../../../scripts/x-poster/generator";
import { generateOAuth1Header, percentEncode } from "../../../scripts/x-poster/x-client";

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
