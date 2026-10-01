import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { NewRelicSnippet } from "@/components/NewRelicSnippet";
import { getYearsOfExperience } from "@/lib/utils";
import "./globals.css";

export function generateMetadata(): Metadata {
  const years = getYearsOfExperience();
  const description = `Enterprise engineer going deep on AI. I build AI agents and automation for real businesses — backed by ${years} years shipping production systems on Azure.`;
  return {
    metadataBase: new URL("https://www.apurvsinghal.com"),
    title: "Apurv Singhal — AI Engineer & Builder",
    description,
    keywords: [
      "Apurv Singhal",
      "AI Engineer",
      "Azure Cloud",
      "Platform Engineering",
      "DevOps",
      "AI Agents",
      "ADM Guard",
      "Melbourne",
      "Australia",
    ],
    alternates: {
      canonical: "https://www.apurvsinghal.com",
    },
    openGraph: {
      title: "Apurv Singhal — AI Engineer & Builder",
      description,
      url: "https://www.apurvsinghal.com",
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
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfAnalyticsToken =
    process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ||
    (process.env.NODE_ENV === "production"
      ? "c23a74586cfb4b81adf2bda629859be6"
      : undefined);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.apurvsinghal.com/#person",
        name: "Apurv Singhal",
        url: "https://www.apurvsinghal.com",
        sameAs: [
          "https://github.com/ApurvSinghal",
          "https://www.linkedin.com/in/apurvsinghal28",
          "https://x.com/apurvsinghal28",
        ],
        jobTitle: "Lead Consultant (Cloud & Platform) & AI Engineer",
        worksFor: {
          "@type": "Organization",
          name: "Capgemini",
        },
        knowsAbout: [
          "Azure Cloud Architecture",
          "Platform Engineering",
          "DevOps & CI/CD",
          "Applied AI Systems",
          "AI Agents",
          "Model Context Protocol (MCP)",
        ],
        image: "https://www.apurvsinghal.com/opengraph-image",
        email: "mailto:me@apurvsinghal.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.apurvsinghal.com/#website",
        name: "Apurv Singhal",
        url: "https://www.apurvsinghal.com",
        description:
          "Enterprise engineer going deep on AI. Portfolio showcasing AI agents, Azure platform architecture, and production case studies.",
        publisher: {
          "@id": "https://www.apurvsinghal.com/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <NewRelicSnippet />
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
          <div className="print:hidden">
            <ChatWidget />
          </div>
        </ThemeProvider>
        {cfAnalyticsToken ? (
          <Script
            id="cloudflare-analytics"
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({
              token: cfAnalyticsToken,
              spa: true,
            })}
          />
        ) : null}
      </body>
    </html>
  );
}
