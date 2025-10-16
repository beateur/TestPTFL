# PRD-005 — Contacts & Notifications

## Context
The platform needs to capture visitor inquiries and deliver them to artists with timely notifications. Currently, no contact form exists on public sites and the backend lacks a Contacts module. This PRD introduces the data model, API, and initial UI experiences for contact management.

## Objectives & Success Metrics
- Enable visitors to submit messages that reach artists within one minute via email notification.
- Provide artists with an inbox to triage and respond to messages.
- Achieve >80% response rate within 48 hours for contact messages during beta.

## Personas & User Stories
- **Visitor/fan**: Wants to contact the artist or booking agent quickly with assurance the message was received.
- **Artist/manager**: Needs to view, categorize, and respond to incoming messages from dashboard.
- **Support agent**: Requires visibility into message delivery status for troubleshooting.

### Core User Stories
1. As a visitor, I can submit a message via the public contact form, receive confirmation, and optionally subscribe to updates.
2. As an artist, I can view all messages in my inbox, filter by status (new, in progress, archived), and mark them accordingly.
3. As an artist, I receive email notifications when new messages arrive, respecting my notification preferences.
4. As the system, I log delivery attempts and notify support if email delivery fails.

## Scope
- Public contact form component (embedded via PRD-004 runtime) with fields: `name`, `email`, `message`, `subject`, `subscribe` toggle.
- NestJS Contacts module with endpoints: `POST /artists/:id/contacts`, `GET /artists/:id/contacts`, `PATCH /contacts/:id` (status updates), `POST /contacts/:id/reply` (stub for future email reply).
- Supabase tables: `contact_messages`, `contact_message_events` for delivery logs, `notification_preferences` for artists.
- Dashboard inbox UI with list view, filters, message detail panel, and status controls.
- Email notification via Supabase Functions or external provider (e.g., Resend) with templated content.

## Out of Scope
- Two-way email threading (future collaboration PRD).
- SMS or push notifications.
- Automated chatbot responses.

## UX & Content Requirements
- Public form uses theme-aware styling, includes privacy notice, and handles validation with inline errors.
- Dashboard inbox adopts accessible keyboard navigation, virtualization for large lists, and quick actions.
- Provide confirmation toast/snackbar after status updates and replies.
- Email template matches brand design and includes unsubscribe/manage preferences link.

## Technical Requirements
- Validate public submissions server-side with rate limiting (per IP and per artist) to mitigate spam.
- Implement CAPTCHA (hCaptcha/Turnstile) toggleable per plan to reduce abuse.
- Ensure RLS policies restrict message visibility to owning accounts and authorized collaborators.
- Integrate email provider via NestJS service; support retries and log failures in `contact_message_events`.
- Dashboard uses React Query for fetching and optimistic updates for status changes.

## Dependencies
- Authentication and account context from PRD-002.
- Runtime contact section from PRD-004 for public submissions.
- Notification infrastructure (email provider, secrets management) set up per PRD-008.

## Acceptance Criteria
- [ ] Public form submits messages to backend, stores them, and returns confirmation within 2 seconds.
- [ ] Artists can view and update message status in dashboard with real-time UI updates.
- [ ] Email notifications send on new message with failure logging and alerting.
- [ ] Rate limiting and CAPTCHA reduce spam (≤2% spam rate measured during beta).
- [ ] Automated tests cover submission, retrieval, status updates, and email dispatch.

## Instrumentation
- Track events: `contacts.message_submit`, `contacts.notification_sent`, `contacts.notification_failed`, `contacts.status_change`.
- Capture form conversion metrics and spam detection stats for analytics dashboards (PRD-006).

## Timeline & Milestones
- **Data model & API**: 4 days.
- **Public form & dashboard UI**: 5 days.
- **Notifications & QA**: 3 days including deliverability tests.

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
