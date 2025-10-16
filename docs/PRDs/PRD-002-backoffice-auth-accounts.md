# PRD-002 — Back-office Auth & Accounts

## Context
The back-office experience currently uses a local Zustand store with no authentication, user accounts, or enforcement of plan constraints. The blueprint requires Supabase authentication, multi-artist account management, and plan-aware access to features.

## Objectives & Success Metrics
- Enable secure login for internal and external users using Supabase Auth (magic link + OAuth providers).
- Ensure every dashboard action operates within the context of an authenticated account and selected artist profile.
- Achieve <1% authentication-related support tickets by delivering clear UX flows and robust error handling.

## Personas & User Stories
- **Artist owner**: Needs to log in, manage their artist profiles, and understand plan entitlements.
- **Label administrator**: Manages multiple artists and invites collaborators with scoped permissions.
- **Support agent**: Requires visibility into account status and ability to impersonate for troubleshooting (future iteration).

### Core User Stories
1. As an artist owner, I can log in via Supabase Auth and be redirected to the dashboard with my artist list loaded.
2. As a multi-artist administrator, I can switch between artist profiles and see plan-specific limits reflected in the UI.
3. As a logged-in user, I can view my account details, subscription status, and invite collaborators (scope: viewing only; invites planned later).
4. As the system, I enforce plan limits (pages, sections, storage) by disabling or warning when limits are reached.

## Scope
- Integrate Supabase Auth in the Next.js App Router with SSR-aware session handling.
- Create account context provider fetching user profile and associated artists from API.
- Implement artist switcher component with plan badge and limit summary.
- Display account overview page with plan details, usage metrics, and upgrade CTA.
- Add plan enforcement hooks to Page Builder entry points (read-only when over limit).
- Handle logout, session expiration, and error states gracefully.

## Out of Scope
- Team invitations and role management (captured in future collaboration PRD).
- Billing upgrade flow implementation (covered by PRD-007).
- Backend RBAC policies beyond Supabase RLS templates defined here.

## UX & Content Requirements
- Auth screens must follow brand style, support dark mode, and include accessible form labels.
- Provide contextual messaging when approaching plan limits (progress bars, tooltips).
- Ensure skeleton loaders for artist data to maintain perceived performance.
- Error states should include actionable next steps (e.g., “Retry” button, contact support link).

## Technical Requirements
- Use Supabase JS client on the server and client to manage sessions; implement edge-friendly configuration.
- Store session tokens securely via HttpOnly cookies using Supabase helpers for Next.js App Router.
- Extend NestJS API with `/auth/profile` and `/accounts/:id/artists` endpoints protected by JWT validation.
- Define Supabase Row-Level Security policies to restrict artist data to owning accounts.
- Update frontend data fetching (React Query) to use authenticated requests and handle 401/403 responses.

## Dependencies
- Supabase project configured with Auth and RLS policies.
- New backend modules for Auth/Accounts or extensions to existing services.
- Design input for auth screens and plan limit messaging.
- Billing plan metadata from PRD-007 for enforcement thresholds.

## Acceptance Criteria
- [ ] Users can log in using Supabase Auth and remain authenticated across browser refreshes.
- [ ] Dashboard displays only artists linked to the authenticated account.
- [ ] Plan limits are visible and enforced (prevent creation actions when over limit).
- [ ] API rejects unauthenticated requests with appropriate status codes.
- [ ] Automated tests cover login flow, artist fetching, and plan enforcement checks.

## Instrumentation
- Log auth events: `auth.login_success`, `auth.login_failure`, `auth.logout`.
- Track plan limit warnings: `accounts.plan_limit_warning`, `accounts.plan_limit_block`.
- Capture artist switch interactions for analytics dashboards.

## Timeline & Milestones
- **Auth integration spike**: 3 days to configure Supabase and Next.js session handling.
- **Account context & UI**: 4 days for data fetching, components, and plan enforcement.
- **QA & security review**: 3 days including penetration tests and RLS validation.

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
