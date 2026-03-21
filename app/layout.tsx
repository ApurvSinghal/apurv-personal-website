import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
    siteName: 'Apurv Singhal',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Apurv Singhal - Software Engineer',
    description: 'Software engineer building digital experiences. Portfolio showcasing projects, skills, and experience.',
    creator: '@apurvsinghal28',
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <SpeedInsights />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
