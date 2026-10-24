# CLAUDE.md — digitalcrew-agent-template

## The repository
- Next.js application template for Digital Crew agents: localized routing, dashboard shell, login / sign-up pages wired to `@digitalcrew/auth` (better-auth).
- Stack: Next.js 16 (App Router, `--webpack` in dev and build), React 19, strict TypeScript, Tailwind CSS 4, shadcn/ui, next-intl, next-themes, zod.
- Package manager: npm (`package-lock.json`, the only lockfile in the repository).
- Node version: not pinned in the repository (no `.nvmrc` or `engines`); CI uses Node 24.
- `@digitalcrew/auth` is a git dependency pinned to a commit SHA of the digitalcrew-auth repository (see `package.json`). `npm ci` installs it with its own `dist/`, so no sibling clone is needed.

## Commands (package.json)
- Install: `npm install` (README); `npm ci` to leave the lockfile untouched.
- Dev: `npm run dev` (http://localhost:3000, redirects to `/en`)
- Lint: `npm run lint`
- Typecheck: `npm run typecheck` (`tsc --noEmit`)
- Format: `npm run format` (Prettier writes `**/*.{ts,tsx}`)
- Build: `npm run build`; start: `npm run start`
- Tests: no test script and no test file in the repository.
- CI: `.github/workflows/ci.yml` runs `npm ci`, lint, typecheck, build and `npm audit --omit=dev --audit-level=critical`.
- `npm run auth:migrate` runs the `@digitalcrew/auth` database migrations: do not run it unless explicitly asked.

## Structure
- `app/[locale]/(public)/`: login, sign-up; `app/[locale]/(dashboard)/`: dashboard, settings, support.
- `app/api/auth/[...all]/route.ts`: auth handler (`@digitalcrew/auth/http`).
- `features/`: business modules (auth, landing, settings, support).
- `components/ui/`: shadcn components (add with `npx shadcn@latest add <name>`); `components/layout/`: sidebar, header.
- `lib/i18n/routing.ts`: locales; `lib/auth/`: client and session.
- `messages/<locale>.json`: next-intl strings; `middleware.ts`: next-intl middleware.
- Import alias `@/*` points to the root.

## Rules
- i18n: 4 locales `en`, `fr`, `es`, `zh` (`localePrefix: "always"`). Every key added or changed is changed in all 4 `messages/*.json` files (today they have the same keys).
- Adding a locale means changing together `lib/i18n/routing.ts` (`locales` and `localeNames`), the `matcher` in `middleware.ts` and a new `messages/<locale>.json`.
- Environment variables: only dummy values in `.env.example`. The code also reads `NEXT_PUBLIC_APP_URL`, which is missing from `.env.example` (`NEXT_PUBLIC_GOOGLE_AUTH` is there, commented out).
- No hard-coded production host: URLs come from environment variables (fallback `http://localhost:3000`).
- Style: Prettier with no semicolons, double quotes, `trailingComma: es5`, Tailwind class sorting.
- Add tests with every change once a test tool is in place; today, at least lint and typecheck.

## Git flow
- Default branch: `main` (a `develop` branch also exists on origin).
- Working branch: `claude/<card-key>-<keyword>`.
- PR to `main`, human review required.
- Never push to `main` or `develop`, never merge, never force-push.
- Before pushing: `npm run lint` and `npm run typecheck` (no tests to run).
