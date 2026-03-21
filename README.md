# Apurv Singhal Personal Website

Personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The site presents experience, projects, social links, and a contact form backed by Supabase, with optional email notifications through Resend.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for contact message storage
- Resend for contact email notifications
- Vercel Analytics and Vercel Speed Insights

## Features

- Single-page portfolio with anchored section navigation
- Responsive desktop and mobile layout
- Resume download from `public/documents/resume.pdf`
- Contact form posting to `/api/contact`
- Optional Google Analytics integration through `NEXT_PUBLIC_GA_ID`
- Runtime performance monitoring via Vercel Speed Insights

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
pnpm lint     # Run ESLint
pnpm test     # Run all test categories
pnpm test:unit
pnpm test:integration
pnpm test:api
pnpm test:component
pnpm test:smoke
pnpm test:e2e
pnpm test:a11y
```

## Testing Coverage

- Unit tests: utility-level logic
- Integration tests: Supabase REST helper behavior
- API tests: `/api/contact` success and failure paths
- Component tests: contact form submit UX states
- Smoke tests: homepage availability and key content
- E2E tests: navigation and form flow behavior
- Accessibility tests: automated critical violation checks

## Environment Variables

### Required for contact form persistence

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Optional for email notifications

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Portfolio <noreply@your-domain.com>
CONTACT_NOTIFICATION_EMAIL=admin@apurvsinghal.com
```

### Optional for analytics

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Notes:

- If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, the contact form still stores messages in Supabase, but email notifications are skipped.
- Vercel Speed Insights is already wired into the app shell and does not need an additional code-side environment variable for basic usage.

### Optional for Supabase keep-alive cron protection

```bash
CRON_SECRET=replace-with-a-random-secret
```

## Contact Form Setup

Create a `contact_messages` table in Supabase with `name`, `email`, `message`, and `created_at` columns.

Once `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, the form submits to `/api/contact` and inserts each message into Supabase.

If Resend is configured as well, the API also:

- sends a notification email to the site owner
- sends an acknowledgement email to the sender

## Supabase Keep-Alive

The project includes a protected keep-alive endpoint at `/api/ping-supabase` plus a Vercel cron entry in `vercel.json` that hits it once per day.

If you set `CRON_SECRET`, Vercel will send it automatically as a bearer token and the route will reject unauthorized requests.

## Deployment

This project is designed for deployment on Vercel. For production deploys, configure the same environment variables in the Vercel project settings.

## Notes

- The site metadata, analytics hooks, and Speed Insights are configured in `app/layout.tsx`.
- The contact API implementation lives in `app/api/contact/route.ts`.