import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
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
