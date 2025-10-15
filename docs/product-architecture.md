# Artistic Portfolio SaaS Blueprint

This document captures the end-to-end vision, architecture, and delivery roadmap for a multi-tenant SaaS platform dedicated to managing and publishing artist portfolios.

## 1. Product Vision & UX

### 1.1 Marketing Landing (domain)
- Single page with hero CTA **"Demander un accès"**, feature highlights, pricing tiers (Freemium, Pro, Studio), target audiences, video testimonial, and live stats (active portfolios, monthly visitors).
- Dark, luxurious design with neon accents, fade-in/up animations on scroll (Framer Motion + Chakra/Shadcn).
- Signup form (name, email, existing portfolio, goals) stored in `lead_applications` for manual moderation.

### 1.2 Back Office (app.domain)
- Supabase auth (magic link & OAuth) supporting multi-artist accounts.
- Dashboard provides key KPIs, charts via `stats_get_overview` edge function, and navigation to Portfolios, Pages & Sections, Media, Contacts, Stats, and Settings.
- Page builder mimics Wix: hierarchical pages, drag-and-drop sections (Hero, GalleryGrid, VideoHighlight, etc.), block styling, responsive controls, live preview via Next.js Preview Mode, and SEO controls.
- Plan enforcement: Freemium (3 pages, no contact form, 1 GB storage), Pro (unlimited pages, contacts, advanced stats, 10 GB), Studio (multi-collaborators, custom domain, video CDN, premium support).

### 1.3 Artist Sites (artistname.domain)
- Multi-tenant Next.js resolving artist via host middleware.
- Themed experiences (Dark Luxe, Minimal Neon, Gallery Grid) with customizable tokens.
- Dynamic navigation and section rendering from JSON, animations via Framer Motion, lazy media loading, accessibility (WCAG AA) and JS-off fallback.
- Contact form (paid plans) storing entries in `contact_messages` and sending notifications.

## 2. Technical Architecture

### 2.1 Front-end
- Next.js 14 (App Router, TypeScript, Server Actions) with Chakra UI (marketing & back office), Shadcn components, and custom design system (artist sites via Stitches/Emotion).
- State management through React Query and Zustand (builder).
- Builder data structure: `PageDefinition` with typed sections (Hero, GalleryGrid, VideoHighlight, RichText, Quote, CTA, Schedule, CustomHTML) using dnd-kit for drag-and-drop.
- Media uploads directly to Supabase Storage with signed URLs; video transcoding metadata tracked.
- Analytics script posts to `/api/track` edge function for Supabase ingestion.

### 2.2 Backend (NestJS)
- Modules: Auth, Artists, Pages, Assets, Stats, Contacts, Billing, Plans, Leads, Notifications.
- RESTful CRUD with optional live updates (WebSocket/SSE) for builder, public portfolio endpoints for static fallback.
- Dockerized deployment: Next apps on Vercel, Nest API on Render/Fly.io, secrets via Doppler/1Password.

### 2.3 Database (Supabase/Postgres)
- Core tables: `accounts`, `artists`, `pages`, `sections`, `assets`, `contact_messages`, `stats_daily`, `stats_events_raw`, `lead_applications`, `plans`, `account_plan_history`, `collaborators`, `artist_invites`, `webhooks_outbox`.
- RLS enforces ownership; public views expose limited portfolio data; service role handles analytics ingestion.
- Functions & triggers: `fn_update_stats_daily`, `fn_enforce_page_limit`, `fn_notify_contact_message`, `fn_default_artist_slug`, `fn_soft_delete`.

### 2.4 Prisma
- Schema mirrors Supabase with `@map` alignment and multi-tenant middleware verifying account context.
- DTO generation leverages `class-validator` to keep API contracts strict.

## 3. Supabase Edge Functions & Cron
- `track_event` for analytics ingestion.
- Scheduled `aggregate_stats_daily` invoking `fn_update_stats_daily` hourly.
- `notify_contact` for email notifications, `get_public_content` for caching, plus queue integration for transcoding callbacks.
- Monitoring via Supabase Logs and Sentry.

## 4. DevOps & Infrastructure
- Monorepo (Nx/Turbo) containing marketing, artist, back-office Next apps, Nest API, and shared libs.
- CI/CD with GitHub Actions: lint (ESLint/Prettier), tests (Jest/Playwright), build checks, Prisma migrations, and deploy triggers.
- Preview deployments: Vercel (Next) and Render preview (Nest); Supabase migrations automated via `supabase db push`.
- Environments: development, staging, production. Secrets centrally managed; monitoring via Sentry, Logflare, Supabase audit logs.
- Video pipeline integrates Mux or Cloudflare Stream with metadata stored on assets; caching through Next ISR and Supabase public data caches.

## 5. Feature Design Details
- Page builder schemas (Zod), theme token inheritance, responsive breakpoints stored in JSON.
- Multi-artist switching via `CurrentArtistContext` and deep-linked routes, collaborators controlled via RLS.
- Contacts gated by plan, with inbox timeline, tagging, notes.
- Analytics events capture views, CTA clicks, and video plays with hashed device fingerprints; dashboards built with Recharts/Tremor.
- Theming uses artist-level tokens exposed as CSS variables; theme editor enables palette/font tweaks.
- Internationalization with i18next (EN/FR), future multi-language via page duplication.
- Accessibility (alt text, Schema.org markup, dynamic meta tags, automatic sitemaps).

## 6. Security
- Supabase Auth + RLS, JWT-secured communication between Next and Nest, server-side session validation.
- Rate limiting via Nest interceptors, audit logs through `webhooks_outbox` and Supabase logs.

## 7. Implementation Roadmap
1. **Discovery & Setup** – Initialize monorepo, configure Supabase, align Prisma.
2. **Design System** – Establish themes and build marketing/back-office UI.
3. **Auth & Accounts** – Implement Supabase auth, onboarding wizard, multi-artist switch.
4. **Page Builder MVP** – Model pages/sections, build APIs, implement drag-and-drop UI with autosave and preview.
5. **Portfolio Rendering** – Middleware routing, SSG integration, theming & animations.
6. **Contacts & Messaging** – Enable contact forms by plan, create inbox UI.
7. **Analytics** – Event script, edge ingestion, aggregation cron, dashboard visualizations.
8. **Plans & Billing** – Stripe integration, quota enforcement, upgrade flows.
9. **DevOps** – CI/CD pipelines, Supabase migrations automation, deployment configurations.
10. **Testing & QA** – Playwright E2E, Jest unit/integration, analytics load tests.
11. **Documentation** – Developer setup, user guides, operational runbooks.

## 8. Future Enhancements
- Template marketplace, scheduling integrations, real-time collaboration (yjs), React Native mobile uploader, AI assistant for descriptions and curation.

This blueprint empowers an autonomous agent to implement, deploy, and operate the platform end-to-end.

## 9. Monorepo Baseline Implementation

A starter implementation is provided in this dépôt pour permettre aux équipes (ou agents autonomes) de démarrer rapidement :

- **Turborepo + PNPM** orchestrent le build, le lint et les tests sur l'ensemble des apps et packages.
- **Next.js 14** alimente trois applications :
  - `web-marketing` expose la landing marketing sombre/néon avec Chakra UI et Framer Motion.
  - `app-backoffice` propose une première ébauche du dashboard multi-artistes avec Chakra UI, Zustand et React Query.
  - `web-artist` illustre le rendu multi-tenant avec Stitches, Framer Motion et un moteur de sections dynamique.
- **NestJS** (`api-server`) fournit les endpoints de base (santé, leads, artistes, pages, plans) et intègre Prisma comme couche de persistance.
- **Packages partagés** (`@acme/ui`, `@acme/shared`, `@acme/config`) centralisent respectivement les composants UI, types/utilitaires et la configuration.

Cette structure constitue une base modulaire pour continuer l'implémentation décrite dans la roadmap ci-dessus.
