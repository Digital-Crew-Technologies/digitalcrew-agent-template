# CLAUDE.md — digitalcrew-agent-template

## Le dépôt
- Gabarit d'application Next.js pour les agents Digital Crew : routage localisé, coquille de tableau de bord, pages login / sign-up branchées sur `@digitalcrew/auth` (better-auth).
- Stack : Next.js 16.1.7 (App Router, `--webpack` en dev et build), React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, next-intl, next-themes, zod.
- Gestionnaire de paquets : npm (`package-lock.json`, seul lockfile du dépôt).
- Version de Node : non fixée (ni `.nvmrc` ni `engines`).
- `@digitalcrew/auth` est une dépendance locale `file:../digitalcrew-auth` : le dépôt digitalcrew-auth doit être cloné à côté de celui-ci, et ses exports pointent vers `dist/` (construit par son script `build`, `tsc`). Sans ce `dist/`, `npm run typecheck` échoue (TS2307 sur `@digitalcrew/auth` dans `app/api/auth/[...all]/route.ts` et `lib/auth/session.ts`).

## Commandes (package.json)
- Installation : `npm install` (README) ; `npm ci` pour ne pas toucher au lockfile.
- Dev : `npm run dev` (http://localhost:3000, redirige vers `/en`)
- Lint : `npm run lint`
- Typecheck : `npm run typecheck` (`tsc --noEmit`) ; demande `../digitalcrew-auth/dist` (voir plus haut).
- Format : `npm run format` (Prettier écrit sur `**/*.{ts,tsx}`)
- Build : `npm run build` ; démarrage : `npm run start`
- Tests : aucun script de test ni fichier de test dans le dépôt.
- CI : pas de dossier `.github/workflows`.
- `npm run auth:migrate` lance les migrations de base de `@digitalcrew/auth` : ne pas l'exécuter sans demande explicite.

## Structure
- `app/[locale]/(public)/` : login, sign-up ; `app/[locale]/(dashboard)/` : dashboard, settings, support.
- `app/api/auth/[...all]/route.ts` : handler d'auth (`@digitalcrew/auth/http`).
- `features/` : modules métier (auth, landing, settings, support).
- `components/ui/` : composants shadcn (ajout via `npx shadcn@latest add <nom>`) ; `components/layout/` : sidebar, header.
- `lib/i18n/routing.ts` : locales ; `lib/auth/` : client et session.
- `messages/<locale>.json` : textes next-intl ; `middleware.ts` : middleware next-intl.
- Alias d'import `@/*` vers la racine.

## Règles
- i18n : 4 locales `en`, `fr`, `es`, `zh` (`localePrefix: "always"`). Toute clé ajoutée ou modifiée l'est dans les 4 fichiers `messages/*.json` (ils ont aujourd'hui les mêmes clés).
- Ajouter une locale demande de modifier ensemble `lib/i18n/routing.ts` (`locales` et `localeNames`), le `matcher` de `middleware.ts` et un nouveau `messages/<locale>.json`.
- Variables d'environnement : seulement des valeurs factices dans `.env.example`. Le code lit aussi `NEXT_PUBLIC_APP_URL` et `NEXT_PUBLIC_GOOGLE_AUTH`, absentes de `.env.example`.
- Pas d'hôte de prod en dur : les URL passent par les variables d'env (repli `http://localhost:3000`).
- Style : Prettier sans point-virgule, guillemets doubles, `trailingComma: es5`, tri des classes Tailwind.
- Ajouter des tests avec chaque changement quand un outil de test sera en place ; aujourd'hui, au minimum lint et typecheck.

## Flux Git
- Branche par défaut : `main` (une branche `develop` existe aussi sur origin).
- Branche de travail : `claude/<clé-de-la-carte>-<mot-clé>`.
- PR vers `main`, relecture humaine obligatoire.
- Jamais de push sur `main` ou `develop`, jamais de merge, jamais de force-push.
- Avant de pousser : `npm run lint` et `npm run typecheck` (pas de tests à lancer).
