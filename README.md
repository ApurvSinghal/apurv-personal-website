# Personal website content

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/apurv-singhals-projects/v0-personal-website-content)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/rsY4J9kCqJi)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/apurv-singhals-projects/v0-personal-website-content](https://vercel.com/apurv-singhals-projects/v0-personal-website-content)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/rsY4J9kCqJi](https://v0.app/chat/rsY4J9kCqJi)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Contact form (free Supabase setup)

This project supports a free contact form backend using [Supabase](https://supabase.com/).

1. Create a free Supabase project.
2. In SQL Editor, run:

```sql
create table if not exists public.contact_messages (
	id bigint generated always as identity primary key,
	name text not null,
	email text not null,
	message text not null,
	created_at timestamptz not null default now()
);
```

3. In Project Settings → API, copy:
	 - Project URL
	 - service_role secret key
4. In `.env.local`, add:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Restart your dev server (`npm run dev`).

Now the "Send Message" button submits to `/api/contact`, and messages are stored in `contact_messages`.