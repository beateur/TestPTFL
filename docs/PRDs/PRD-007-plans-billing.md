# PRD-007 — Plans & Billing

## Context
The product offers static plan descriptions with no billing infrastructure or enforcement logic. The blueprint requires monetization through Stripe, plan upgrades/downgrades, quota enforcement, and reporting. This PRD defines the initial billing stack and plan management.

## Objectives & Success Metrics
- Launch self-serve billing with Stripe Checkout and Billing Portal for all plan tiers.
- Enforce plan quotas (pages, storage, contact volume) within the application.
- Achieve $10k MRR within three months of launch while maintaining churn below 5%.

## Personas & User Stories
- **Artist owner**: Wants to upgrade/downgrade plans, understand pricing, and manage payment methods.
- **Finance/ops**: Needs accurate revenue reporting and audit trails for compliance.
- **Support agent**: Requires tools to adjust plans manually and handle billing issues.

### Core User Stories
1. As an artist owner, I can initiate a trial, upgrade via Stripe Checkout, and see plan changes reflected immediately.
2. As an artist owner, I can manage my subscription (update payment method, cancel) via Stripe Billing Portal.
3. As the system, I enforce plan quotas across builder and runtime, prompting upgrades when limits are hit.
4. As finance, I can view plan history, invoices, and revenue metrics for reconciliation.

## Scope
- Stripe integration (Checkout sessions, Customer Portal) with webhooks to handle subscription lifecycle events.
- Supabase schema updates: `accounts`, `account_plan_history`, `account_usage_metrics`.
- Backend Billing module to process webhooks, update plan status, and expose usage endpoints.
- Frontend billing settings page with current plan, usage bars, upgrade/downgrade CTAs, and billing history.
- Enforcement hooks across builder/runtime: limit page creation, asset uploads, contact submissions based on quotas.
- Trial management: 14-day trial flow with reminders and auto-expiration.

## Out of Scope
- Marketplace revenue sharing or split payments (future iteration).
- Invoicing for enterprise/custom plans (handled by manual sales process initially).
- Tax remittance automation beyond Stripe’s built-in tax features.

## UX & Content Requirements
- Billing settings UI should summarize plan benefits, usage, and next steps when near limits.
- Provide clear messaging for trial states, upcoming invoices, and cancellations.
- Include upgrade banners within builder when nearing limits.
- Ensure forms and CTAs are accessible and responsive.

## Technical Requirements
- Create Stripe products/prices aligned with plan tiers; store IDs in configuration.
- Implement webhook handler verifying signatures and updating Supabase via service layer.
- Store usage metrics (pages count, storage used, contact submissions) and compute against plan quotas nightly.
- Provide feature flags enabling/disabling functionality based on plan level.
- Implement guard middleware in backend endpoints to validate plan permissions before executing.
- Add automated tests for webhook handling, plan transitions, and enforcement logic.

## Dependencies
- Auth/account context from PRD-002 for associating subscriptions.
- Usage metrics instrumentation from PRD-006 to feed quotas.
- DevOps/secret management (PRD-008) for Stripe keys and webhook endpoints.

## Acceptance Criteria
- [ ] Users can upgrade/downgrade via Stripe Checkout and see plan change reflected within 1 minute.
- [ ] Billing portal accessible from dashboard and pre-populated with account details.
- [ ] Quotas enforced consistently across builder/runtime with upgrade prompts.
- [ ] Webhook processing resilient with retries and monitoring.
- [ ] Finance dashboard exports plan history and revenue metrics.

## Instrumentation
- Track events: `billing.checkout_started`, `billing.checkout_completed`, `billing.portal_opened`, `billing.quota_block`.
- Monitor webhook success/failure metrics and alert on anomalies.

## Timeline & Milestones
- **Stripe integration & webhooks**: 5 days.
- **Frontend billing UI & enforcement**: 5 days.
- **Testing & launch readiness**: 4 days including finance review.

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
