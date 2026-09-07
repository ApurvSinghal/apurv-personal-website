# Apurv Singhal Personal Website

Personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The site presents experience, projects, social links, and a contact form delivered through Resend email notifications.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Resend for contact email notifications
- Cloudflare Web Analytics

## Features

- Single-page portfolio with anchored section navigation
- Responsive desktop and mobile layout
- Resume download from `public/documents/resume.pdf`
- Contact form posting to `/api/contact` with in-memory rate limiting and honeypot spam protection
- Optional Cloudflare Web Analytics through `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (production builds only)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` and add the variables listed below.

3. Start the development server:

```bash
pnpm dev
```

4. Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev      # Start local development server
pnpm build    # Create production build
pnpm start    # Start production server
pnpm clean    # Remove generated local artifacts
pnpm lint     # Run ESLint
pnpm test     # Run Vitest test suite (unit + API tests)
pnpm x:post   # Post scheduled daily post to X (Twitter)
pnpm x:test   # Test daily post generator in dry-run mode
```

## Testing Coverage

- Unit tests: utility-level logic and X poster generator
- API tests: `/api/contact` validation, honeypot, and submission handling

## Environment Variables

### Required for contact form delivery

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Portfolio <noreply@your-domain.com>
CONTACT_NOTIFICATION_EMAIL=me@apurvsinghal.com
```

### Optional for analytics

```bash
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=your_cloudflare_analytics_token
```

Cloudflare Web Analytics only loads in production builds (`NODE_ENV=production`) and only when `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` is set. The token can be found in the Cloudflare Dashboard under **Analytics & Logs** > **Web Analytics** > **Manage Site**.

### Optional for X (Twitter) automation bot

```bash
X_API_KEY=your_key
X_API_SECRET=your_secret
X_ACCESS_TOKEN=your_token
X_ACCESS_TOKEN_SECRET=your_token_secret
GEMINI_API_KEY=your_gemini_key
```

## Deployment

This project is designed for deployment on Vercel. For production deploys, configure the same environment variables in your Vercel project settings.
