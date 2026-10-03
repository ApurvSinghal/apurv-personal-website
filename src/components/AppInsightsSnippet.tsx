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
!function(v,y,T){var t=T.name||"appInsights";v[t]=v[t]||function(c){var l={src:T.src,cfg:T.cfg,name:t};return function(){var e=arguments;return new Promise(function(n,a){c.push([l,e,n,a])})}}({queue:[]});var a=v[t];a.queue=a.queue||[];a.version=2.0;function r(e){var t=y.createElement("script");t.src=e;t.async=!0;var n=y.getElementsByTagName("script")[0];if(n&&n.parentNode){n.parentNode.insertBefore(t,n)}else{y.head.appendChild(t)}}r(T.src);var o=function(e){return function(){var t=arguments;a.queue.push(function(){a[e].apply(a,t)})}};["trackEvent","trackPageView","trackException","trackTrace","trackDependencyData","trackMetric","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"].forEach(function(e){a[e]=o(e)});
}(window,document,{
  src: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js",
  name: "appInsights",
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
