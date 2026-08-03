import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalErrorHandler } from "@/components/global-error-handler";
import { getYearsOfExperience } from "@/lib/utils";
import "./globals.css";

export function generateMetadata(): Metadata {
  const years = getYearsOfExperience();
  const description = `Enterprise engineer going deep on AI. I build AI agents and automation for real businesses — backed by ${years} years shipping production systems on Azure.`;
  return {
    metadataBase: new URL("https://apurvsinghal.com"),
    title: "Apurv Singhal — AI Engineer & Builder",
    description,
    openGraph: {
      title: "Apurv Singhal — AI Engineer & Builder",
      description,
      url: "https://apurvsinghal.com",
      images: ["/opengraph-image"],
      siteName: "Apurv Singhal",
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Apurv Singhal — AI Engineer & Builder",
      description,
      creator: "@apurvsinghal28",
      images: ["/opengraph-image"],
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_CLARITY_ID
      : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://apurvsinghal.com/#person",
        name: "Apurv Singhal",
        url: "https://apurvsinghal.com",
        sameAs: [
          "https://github.com/ApurvSinghal",
          "https://www.linkedin.com/in/apurvsinghal28",
          "https://x.com/apurvsinghal28",
        ],
        jobTitle: "AI Engineer",
        email: "mailto:me@apurvsinghal.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://apurvsinghal.com/#website",
        name: "Apurv Singhal",
        url: "https://apurvsinghal.com",
        description:
          "Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.",
        publisher: {
          "@id": "https://apurvsinghal.com/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <GlobalErrorHandler />
        <Analytics />
        <SpeedInsights />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        {clarityId ? (
          <Script id="clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
