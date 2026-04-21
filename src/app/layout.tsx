import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NewRelicBrowserProvider } from '@/components/newrelic-browser-provider'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://apurvsinghal.com'),
  title: 'Apurv Singhal - Software Engineer',
  description: 'Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.',
  openGraph: {
    title: 'Apurv Singhal - Software Engineer',
    description: 'Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.',
    url: 'https://apurvsinghal.com',
    images: ['/opengraph-image'],
    siteName: 'Apurv Singhal',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apurv Singhal - Software Engineer',
    description: 'Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.',
    creator: '@apurvsinghal28',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://apurvsinghal.com/#person',
        name: 'Apurv Singhal',
        url: 'https://apurvsinghal.com',
        sameAs: [
          'https://github.com/ApurvSinghal',
          'https://www.linkedin.com/in/apurvsinghal28',
          'https://x.com/apurvsinghal28',
        ],
        jobTitle: 'Software Engineer',
        email: 'mailto:me@apurvsinghal.com',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://apurvsinghal.com/#website',
        name: 'Apurv Singhal',
        url: 'https://apurvsinghal.com',
        description:
          'Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.',
        publisher: {
          '@id': 'https://apurvsinghal.com/#person',
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NewRelicBrowserProvider />
          {children}
        </ThemeProvider>
        <SpeedInsights />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
