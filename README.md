# Apurv Singhal Personal Website

Personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The site presents experience, projects, social links, and a contact form delivered through Resend email notifications.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
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
pnpm clean    # Remove generated local artifacts
pnpm lint     # Run ESLint
pnpm test     # Run all test categories
pnpm test:unit
pnpm test:api
pnpm test:component
pnpm test:smoke
pnpm test:e2e
pnpm test:a11y
```

## Testing Coverage

- Unit tests: utility-level logic
- API tests: `/api/contact` success and failure paths
- Component tests: contact form submit UX states
- Smoke tests: homepage availability and key content
- E2E tests: navigation and form flow behavior
- Accessibility tests: automated critical violation checks

## Environment Variables

### Required for contact form delivery

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Portfolio <noreply@your-domain.com>
CONTACT_NOTIFICATION_EMAIL=me@apurvsinghal.com
```

### Optional for analytics

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Notes:

- If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, `/api/contact` returns `503` to avoid silently dropping messages.
- Vercel Speed Insights is already wired into the app shell and does not need an additional code-side environment variable for basic usage.

### Optional for protected healthcheck cron

```bash
CRON_SECRET=replace-with-a-random-secret
```

### Optional for distributed contact rate limiting

If configured, `/api/contact` uses Upstash Redis for cross-instance rate limiting. If not configured, the API falls back to in-memory limiting.

```bash
UPSTASH_REDIS_REST_URL=https://<your-instance>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your_upstash_token>
```

## Contact Form Setup

When Resend is configured, `/api/contact`:

- sends a notification email to the site owner
- sends an acknowledgement email to the sender

## Healthcheck Ping

The project includes a protected endpoint at `/api/ping-health` plus a Vercel cron entry in `vercel.json` that hits it once per day.

If you set `CRON_SECRET`, Vercel will send it automatically as a bearer token and the route will reject unauthorized requests.

### Verifying Cron Is Working

1. Deploy the latest code to Vercel.
2. Open Vercel Dashboard -> Project -> Settings -> Cron Jobs and confirm `/api/ping-health` is enabled.
3. Open Vercel Dashboard -> Project -> Logs and filter for `Healthcheck ping succeeded`.
4. Confirm log entries appear daily and include a recent `checkedAt` timestamp.
5. (Optional) Manually test once by calling `/api/ping-health` with `Authorization: Bearer <CRON_SECRET>` and verify a `200` response with `{ "ok": true, "checkedAt": "..." }`.

## Deployment

This project is designed for deployment on Vercel. For production deploys, configure the same environment variables in the Vercel project settings.

## Notes

- The site metadata, analytics hooks, and Speed Insights are configured in `src/app/layout.tsx`.
- The contact API implementation lives in `src/app/api/contact/route.ts`.
