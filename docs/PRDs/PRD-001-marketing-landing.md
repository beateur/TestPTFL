# PRD-001 — Marketing Landing V1

## Context
The public marketing site currently offers only a hero section, static metrics, and a basic feature grid. The product blueprint requires a conversion-focused landing including pricing, audience segmentation, testimonials, and a lead capture form that persists submissions to `lead_applications` via the existing `POST /leads` endpoint.

## Objectives & Success Metrics
- Achieve a minimum 5% lead submission rate from unique visitors during the beta campaign.
- Collect at least 100 qualified lead applications within the first month after launch.
- Reduce bounce rate on the landing page below 45% by providing richer content and clear CTAs.

## Personas & User Stories
- **Independent artist**: Wants to understand pricing, fit, and submit an application with minimal friction.
- **Label marketer**: Needs detailed plan comparison and proof of social proof (testimonials) before contacting sales.
- **Internal growth marketer**: Requires analytics hooks to measure effectiveness of each section.

### Key User Stories
1. As a prospective customer, I can review pricing tiers with feature comparison to choose the right plan.
2. As a visitor, I can watch or preview a testimonial to build trust.
3. As an interested artist, I can submit my information and goals through a form that confirms receipt.
4. As the growth marketer, I can track interactions (section views, form submissions) through analytics events.

## Scope
- Pricing section with three tiers (Freemium, Pro, Studio) including feature highlights and CTA buttons.
- Target audience segment section explaining primary use cases (solo artist, label, creative agency).
- Video testimonial block with responsive layout (embedded video or placeholder thumbnail + modal) following dark neon styling.
- Persistent lead capture form with fields: `name`, `email`, `portfolioUrl`, `primaryGoal`, `planInterest`.
- API integration with `POST /leads`, including optimistic UI state and error handling.
- Framer Motion animations for section entrance and CTA hover states.
- Analytics events for pricing CTA clicks, testimonial plays, and lead submissions.

## Out of Scope
- A/B testing framework (captured in a future growth iteration).
- Localization / translation support.
- Automated email workflows following lead submission (covered in Contacts PRD).

## UX & Content Requirements
- Maintain existing dark neon visual identity; align typography and spacing with design system tokens.
- All sections should support responsive layouts (mobile-first, up to 1440px).
- CTA buttons should be accessible (ARIA labels, focus states, 4.5:1 contrast).
- Form should validate inputs (email format, URL pattern, required fields) and show inline error messages.
- Success state displays thank-you message and encourages exploration of artist portfolios.

## Technical Requirements
- Extend landing page component to import new section components located under `apps/web/app/(marketing)/components`.
- Use Chakra UI primitives with design tokens; incorporate Framer Motion for animation wrappers.
- Integrate form submission via React Query mutation to `/api/leads` proxy (Next.js route) that calls NestJS `POST /leads`.
- Implement loading state, disabled submit button, and retry strategy on network failure.
- Ensure lead data persists in Supabase `lead_applications` table.

## Dependencies
- NestJS Leads module (already available) for backend persistence.
- Chakra UI, Framer Motion, React Hook Form (if introduced) for UI/UX fidelity.
- Analytics instrumentation defined alongside PRD-006.

## Acceptance Criteria
- [ ] Pricing, audience, testimonial, and lead form sections render on desktop and mobile viewports.
- [ ] Form submission triggers API request that stores data in Supabase and returns success state.
- [ ] Error states handle validation and server failures gracefully with user feedback.
- [ ] Analytics events fire for CTA interactions and lead submission confirmations.
- [ ] Page passes Lighthouse accessibility score ≥ 90.

## Instrumentation
- Track events: `landing.pricing.cta_click`, `landing.testimonial.play`, `landing.lead.submit_success`, `landing.lead.submit_error`.
- Include section view tracking via Intersection Observer to populate analytics dashboards (PRD-006).

## Timeline & Milestones
- **Design alignment**: 2 days to validate layout and copy with design team.
- **Implementation**: 4 days for components, animations, API integration.
- **QA & analytics validation**: 2 days including accessibility review and event testing.

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
