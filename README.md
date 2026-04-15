# Apurv Singhal Personal Website

Personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The site presents experience, projects, social links, and a contact form backed by Supabase, with optional email notifications through Resend.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase for contact message storage
- Resend for contact email notifications
- New Relic for server-side monitoring
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
pnpm newrelic:alerts # Create/update New Relic alert conditions
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

### Optional for New Relic monitoring

```bash
NEW_RELIC_APP_NAME=apurv-personal-website
NEW_RELIC_LICENSE_KEY=your_new_relic_license_key
NEW_RELIC_LOG=stdout
NEW_RELIC_ENABLED=true
```

### Optional for New Relic browser monitoring

```bash
NEXT_PUBLIC_NEW_RELIC_BROWSER_ENABLED=true
NEXT_PUBLIC_NEW_RELIC_BROWSER_ACCOUNT_ID=your_new_relic_account_id
NEXT_PUBLIC_NEW_RELIC_BROWSER_AGENT_ID=your_browser_agent_id
NEXT_PUBLIC_NEW_RELIC_BROWSER_APPLICATION_ID=your_browser_application_id
NEXT_PUBLIC_NEW_RELIC_BROWSER_KEY=your_browser_key
NEXT_PUBLIC_NEW_RELIC_BROWSER_TRUST_KEY=your_browser_trust_key
NEXT_PUBLIC_NEW_RELIC_BROWSER_REGION=eu
NEXT_PUBLIC_NEW_RELIC_BROWSER_APP_NAME=apurv-personal-website-browser
```

Notes:

- If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, the contact form still stores messages in Supabase, but email notifications are skipped.
- Vercel Speed Insights is already wired into the app shell and does not need an additional code-side environment variable for basic usage.
- Set the New Relic environment variables in Vercel and let Next.js load the agent through `src/instrumentation.ts`.

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

### Verifying Cron Is Working

1. Deploy the latest code to Vercel.
2. Open Vercel Dashboard -> Project -> Settings -> Cron Jobs and confirm `/api/ping-supabase` is enabled.
3. Open Vercel Dashboard -> Project -> Logs and filter for `Supabase ping succeeded`.
4. Confirm log entries appear daily and include a recent `checkedAt` timestamp.
5. (Optional) Manually test once by calling `/api/ping-supabase` with `Authorization: Bearer <CRON_SECRET>` and verify a `200` response with `{ "ok": true, "checkedAt": "..." }`.

## Deployment

This project is designed for deployment on Vercel. For production deploys, configure the same environment variables in the Vercel project settings.

New Relic is configured through `newrelic.js`, `src/instrumentation.ts`, and runtime environment variables.

Browser monitoring is configured through `src/components/newrelic-browser-provider.tsx` and `src/lib/newrelic-browser.ts` using `NEXT_PUBLIC_NEW_RELIC_BROWSER_*` environment variables.

## New Relic Custom Events

The API layer emits custom events to New Relic for business and reliability analytics:

- `ContactFlowEvent` from `/api/contact` for submit, validation, database, email, and response lifecycle stages.
- `PingHealthEvent` from `/api/ping-supabase` for success, failure, and unauthorized ping outcomes.

These events are recorded in:

- `src/app/api/contact/route.ts`
- `src/app/api/ping-supabase/route.ts`
- `src/lib/newrelic.ts`
- `src/components/newrelic-browser-provider.tsx`
- `src/lib/newrelic-browser.ts`

## New Relic Alerts Automation

The repo includes an alert provisioning script plus a GitHub Actions workflow for keeping alert conditions in sync:

- Script: `scripts/setup-newrelic-alerts.mjs`
- Workflow: `.github/workflows/newrelic-alerts.yml`

Required secrets or environment variables for alert provisioning:

- `NEW_RELIC_USER_API_KEY`
- `NEW_RELIC_ACCOUNT_ID`
- `NEW_RELIC_REGION` (`eu` or `us`)

## New Relic Dashboard

Dashboard created in account `7920207`:

- Name: `apurv-personal-website Ops`
- Link: `https://one.eu.newrelic.com/redirect/entity/NzkyMDIwN3xWSVp8REFTSEJPQVJEfGRhOjI2OTc4ODk`

Widgets included:

- API latency p95
- API error rate
- Ping job success trend
- Contact submissions per day

## Release Markers On Deploy

A GitHub Actions workflow posts a New Relic deployment marker on every push to `main`:

- Workflow: `.github/workflows/newrelic-release-marker.yml`

Required GitHub repository secrets:

- `NEW_RELIC_USER_API_KEY`
- `NEW_RELIC_APP_ID`

Current New Relic APM application id for this project: `491407208`.

## Notes

- The site metadata, analytics hooks, and Speed Insights are configured in `src/app/layout.tsx`.
- The contact API implementation lives in `src/app/api/contact/route.ts`.
