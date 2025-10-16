# PRD-004 — Portfolio Runtime Multi-tenant

## Context
The public-facing artist sites currently load a mock configuration and display only hero and gallery sections. The blueprint mandates host-based tenant resolution, dynamic navigation, theming, accessibility compliance, and plan-dependent features such as contact forms. This PRD defines the first production-ready runtime.

## Objectives & Success Metrics
- Serve personalized artist sites using tenant data resolved from the request host.
- Achieve Time To First Byte (TTFB) under 300ms for cached pages and under 1s for uncached renders.
- Maintain Core Web Vitals scores: LCP < 2.5s, CLS < 0.1, FID < 100ms.

## Personas & User Stories
- **Visitor/fan**: Wants a fast, immersive experience tailored to the artist’s brand, with easy contact options.
- **Artist owner**: Expects published pages to reflect builder changes within minutes and respect theme choices.
- **SEO specialist**: Needs structured metadata and accessible markup to rank well.

### Core User Stories
1. As a visitor, when I visit `artistdomain.com`, the site resolves the correct artist and renders their navigation and pages.
2. As an artist, when I publish a page, it becomes available on my public site with the chosen theme and sections.
3. As a visitor on a paid-plan artist site, I can submit a contact form that confirms delivery.
4. As the platform, I can cache responses and serve fallbacks when a tenant is not found.

## Scope
- Middleware or edge function to map request host/subdomain to artist ID using Supabase metadata.
- Dynamic routing in Next.js App Router to fetch artist, navigation, and page definitions from API.
- Theming system with at least two presets (Neon Dark, Minimal Light) and support for custom accent colors.
- Section renderer library covering hero, gallery, quote, CTA, stats, testimonials, and contact form.
- Contact form component that submits to new Contacts API (stub until PRD-005 delivery) with graceful fallback for unavailable plans.
- ISR/SSG strategy with revalidation triggered on publish events and manual purge fallback.
- Accessibility checks (semantic HTML, keyboard navigation, ARIA, color contrast).

## Out of Scope
- Offline mode or service worker caching (future performance initiative).
- Advanced theming editor (handled after builder enhancements).
- Multilingual routing (future globalization PRD).

## UX & Content Requirements
- Align typography and spacing with design system tokens; allow theme to override key colors.
- Provide top navigation with active state and skip-to-content link.
- Ensure responsive layouts across mobile, tablet, and desktop breakpoints.
- Display 404-style fallback with support CTA when tenant not resolved.

## Technical Requirements
- Add middleware (`apps/web/middleware.ts`) to inspect host header, resolve tenant from Supabase `artists` table (domain mapping), and rewrite request to include tenant ID.
- Extend API to expose `GET /runtime/resolve?host=` endpoint and `GET /artists/:id/pages?status=published`.
- Implement React Query (or server actions) to fetch data server-side and hydrate clients.
- Support theme tokens via Chakra UI theme extensions; allow dynamic overrides per artist.
- Implement ISR with revalidation key triggered via webhook from builder publish (PRD-003 integration).
- Provide structured data (JSON-LD) for SEO and open graph tags from page metadata.

## Dependencies
- Page definitions and publish signals from PRD-003.
- Contacts API (PRD-005) for form submission; interim stub returning success message.
- Supabase domain mapping data maintained via dashboard settings.

## Acceptance Criteria
- [ ] Visiting a mapped host renders the correct artist site with navigation and published pages.
- [ ] Theme presets apply consistently, and custom accent color persists across sections.
- [ ] Contact form appears only for eligible plans and submits successfully or displays fallback messaging.
- [ ] Runtime supports ISR revalidation triggered post-publish.
- [ ] Accessibility audit (Lighthouse/axe) scores ≥ 90.

## Instrumentation
- Track events: `runtime.page_view`, `runtime.contact_submit`, `runtime.resolve_failure`.
- Log cache hits/misses and revalidation triggers for observability (PRD-006 integration).

## Timeline & Milestones
- **Tenant resolution & routing**: 3 days.
- **Renderer & theming**: 4 days.
- **Contact integration & QA**: 3 days (with accessibility review).

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft. |
| 2024-05-21 | 1.1 | Roadmap Agent | Livré : runtime multi-tenant, navigation dynamique et formulaire de contact stub. |
