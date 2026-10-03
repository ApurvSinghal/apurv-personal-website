import Script from "next/script";

const CONNECTION_STRING =
  process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING ||
  "InstrumentationKey=bbfd92be-1617-41f6-b233-a11be92634ef;IngestionEndpoint=https://australiaeast-1.in.applicationinsights.azure.com/;LiveEndpoint=https://australiaeast.livediagnostics.monitor.azure.com/;ApplicationId=9859f5c8-298f-409b-85cc-f1cb01c6334b";

export function AppInsightsSnippet() {
  if (!CONNECTION_STRING) return null;

  return (
    <Script
      id="azure-app-insights-browser"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(v,y,T){var S=v.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=T.name||"appInsights";(T.name||v[t])&&(v[t]=function(c){var l={src:T.src,cfg:T.cfg,name:t};return function(){var e=arguments;return new Promise(function(n,a){c.push([l,e,n,a])})}}({}));var n=v[t];if(!n.queue){n.queue=[]}var a=n;a.version=2.0;function r(e){var t=y.createElement(k);t.src=e;t.async=!0;var n=y.getElementsByTagName(k)[0];n.parentNode.insertBefore(t,n)}r(T.src);var o=function(e){return function(){var t=arguments;a.queue.push(function(){a[e].apply(a,t)})}};["trackEvent","trackPageView","trackException","trackTrace","trackDependencyData","trackMetric","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"].forEach(function(e){a[e]=o(e)});
}(window,document,{
  src: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js",
  cfg: {
    connectionString: ${JSON.stringify(CONNECTION_STRING)},
    enableAutoRouteTracking: true
  }
});
`,
      }}
    />
  );
}
