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

## Proactive Pre-Commit Verification (Zero-Defect Standard)
Before committing or pushing any changes to `main`:
1. **Security Audit**: Run `pnpm audit --audit-level=high` — MUST report 0 high/critical vulnerabilities.
2. **Code Lint**: Run `pnpm lint` — MUST pass with 0 errors and 0 warnings.
3. **Unit Tests**: Run `pnpm test:unit` — MUST pass 100%.
4. **Production Build**: Run `pnpm build` — MUST complete without TypeScript or bundling failures.
Never commit or push changes if any of these checks fail. Fix root causes immediately.
