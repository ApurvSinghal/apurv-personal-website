# X (Twitter) Automation Bot Rules

## Engine Overview
- **Script Location**: `scripts/x-poster/`
- **Workflow**: `.github/workflows/daily-x-post.yml`
- **Content Paths**:
  - Priority Queue: `content/x-queue.json`
  - History Log: `content/x-history.json`

## Post Generation & Quality Rules
1. **Persona & Voice**:
   - Hands-on Cloud, Platform, and AI engineer with 7–8 years of experience shipping production systems in Melbourne, Australia. Founder of ADM Guard.
   - Tone: Curious, practical builder sharing real lessons from the trenches. Humble, relatable, and implementation-focused. Avoid preaching, gatekeeping, or corporate jargon.
2. **Strict Privacy & Anonymization Guardrail**:
   - **NEVER** mention any current/past employer names, corporate client names, or specific non-profit names.
   - Always generalize references (e.g., *"large enterprise consulting"*, *"community non-profits"*, *"multi-subscription enterprise client"*).
3. **Safety & Length Limits**:
   - Strict character limit: 280 characters maximum (target under 240 chars for breathing room).
   - Max 1 clean hashtag at the end.
4. **Execution & Testing**:
   - Always run dry-run simulations (`node --no-warnings scripts/x-poster/index.ts --dry-run`) to verify draft length and formatting before triggering live API posts.
