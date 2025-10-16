# PRD-006 — Analytics & Stats

## Context
The dashboard currently displays hardcoded statistics and lacks real tracking of user behavior. The blueprint specifies a comprehensive analytics pipeline with event ingestion, aggregation, and visualization. This PRD defines the initial analytics infrastructure and reporting surfaces.

## Objectives & Success Metrics
- Capture key platform events from marketing site, builder, and runtime with <1% data loss.
- Provide dashboard visualizations for traffic, engagement, and conversion metrics updated hourly.
- Ensure compliance with privacy regulations (GDPR, CCPA) by anonymizing visitor data and honoring consent.

## Personas & User Stories
- **Growth marketer**: Needs to monitor landing page performance and campaign attribution.
- **Artist owner**: Wants to understand portfolio visits, top pages, and lead conversions.
- **Product manager**: Requires insight into builder usage and plan adoption.

### Core User Stories
1. As a growth marketer, I can view traffic trends, conversion funnel, and top acquisition sources on a dashboard.
2. As an artist, I can view visits, unique visitors, contact submissions, and top pages for my portfolio.
3. As the system, I collect events from frontend clients, process them via edge function, and store aggregated data for reporting.

## Scope
- Define event schema (JSON) with required fields: `event`, `timestamp`, `actor`, `context`, `properties`.
- Frontend tracking library that queues events, respects consent, and sends batched requests to `/api/track`.
- Next.js API route `/api/track` forwarding events to Supabase Edge Function `ingest-events` for durable processing.
- Supabase schema additions: `raw_events`, `event_batches`, `stats_daily`, `stats_hourly` tables/views.
- NestJS Stats module exposing endpoints for aggregated metrics (traffic, conversions, builder activity).
- Dashboard analytics UI with charts (Tremor/Recharts), filters (date range, plan, artist), and export options.
- Privacy controls: cookie consent banner, do-not-track compliance, IP anonymization.

## Out of Scope
- Advanced attribution modeling (multi-touch) beyond UTM capture.
- Real-time streaming dashboards (hourly updates suffice for MVP).
- Predictive analytics or machine learning forecasts.

## UX & Content Requirements
- Analytics dashboard integrated into back-office navigation with responsive layout.
- Include descriptive tooltips, legends, and data source explanations.
- Provide empty states when no data available and loading skeletons while fetching.
- Consent banner follows regulatory requirements with clear options.

## Technical Requirements
- Build lightweight client tracker with queue, retry, and offline support using IndexedDB/localStorage fallback.
- Implement Supabase Edge Function to validate payloads, enrich with geo/IP data, and store to `raw_events`.
- Schedule hourly cron job to aggregate stats into `stats_hourly` and daily rollups into `stats_daily`.
- Extend NestJS to query aggregated tables with caching and plan-based access control.
- Ensure PII minimization (hash IPs, avoid storing raw email unless necessary) and allow data deletion requests.
- Add automated tests for event ingestion, aggregation logic, and dashboard queries.

## Dependencies
- PRD-001, PRD-003, PRD-004, PRD-005 features to emit events.
- DevOps infrastructure (PRD-008) for deploying edge functions and cron jobs.
- Legal review for consent copy and data retention policies.

## Acceptance Criteria
- [ ] Frontend clients can send events that are stored and aggregated without data loss.
- [ ] Dashboards display accurate metrics matching sample datasets.
- [ ] Consent management prevents tracking before opt-in and allows opt-out at any time.
- [ ] Aggregations run hourly with monitoring for failures.
- [ ] Documentation details event taxonomy and developer integration steps.

## Instrumentation
- Meta-monitor events: `analytics.ingest_success`, `analytics.ingest_failure`, `analytics.aggregation_failure`.
- Track dashboard usage: `analytics.dashboard_view`, `analytics.filter_change`, `analytics.export`.

## Timeline & Milestones
- **Event schema & tracker**: 4 days.
- **Backend ingestion & aggregation**: 5 days.
- **Dashboard UI & consent management**: 4 days.

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
