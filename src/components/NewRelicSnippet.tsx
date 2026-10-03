import Script from "next/script";

export function NewRelicSnippet() {
  return (
    <Script
      id="new-relic-browser-agent"
      strategy="afterInteractive"
      src="/newrelic.js"
    />
  );
}
