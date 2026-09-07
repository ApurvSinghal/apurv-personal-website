# Project Tech Stack & Architecture Rules

## Stack Overview
- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: `pnpm` (always use `pnpm` rather than `npm` or `yarn`)
- **Styling**: Vanilla CSS and Tailwind CSS / PostCSS

## Engineering Guidelines
- **Strict Typing**: All component props, API request/response payloads, and state models must have explicit types. Avoid `any`.
- **Component Design**: Keep UI components modular, reusable, and accessible. Prefer server components where feasible and explicitly mark client components with `'use client'`.
- **Scripts & Automation**: Automated scripts reside in `scripts/`. Always run validations or dry-runs before executing automated updates against live production APIs.
