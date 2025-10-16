# PRD-003 — Page Builder MVP

## Context
The dashboard lacks any tooling to create or edit artist pages. The product blueprint promises a Wix-like experience with drag-and-drop sections, live preview, and structured page definitions persisted via the API. This PRD scopes the first deliverable to unblock content creation.

## Objectives & Success Metrics
- Allow artists to create and publish pages without engineering intervention.
- Reduce average time to publish a new page to under 15 minutes.
- Capture at least 30 active pages within two weeks of launch.

## Personas & User Stories
- **Artist creator**: Needs an intuitive interface to compose pages using predefined blocks.
- **Label designer**: Requires control over navigation structure and metadata before publishing.
- **Support specialist**: Needs visibility into page versions and ability to assist artists.

### Core User Stories
1. As an artist, I can create a page, add sections (hero, gallery, quote, CTA), and reorder them via drag-and-drop.
2. As an artist, I can edit section content (text, media references, layout options) and see updates in a live preview.
3. As a designer, I can set page metadata (title, slug, SEO description) and mark a page as published.
4. As the system, I autosave changes and warn about unsaved states when navigating away.

## Scope
- Page Builder interface accessible from dashboard navigation.
- Section library with predefined components (hero, gallery, quote, CTA, contact placeholder).
- Drag-and-drop powered by `@dnd-kit` with keyboard accessibility.
- Property editor panel for selected section, supporting forms, toggles, and asset selectors.
- Live preview pane rendering current draft via shared renderer components.
- Autosave mechanism using React Query mutations to persist drafts every 10 seconds or on blur.
- Publish workflow: status toggle, confirmation modal, and timestamp display.

## Out of Scope
- Collaborative editing and presence indicators (future iteration).
- Full asset management (basic URL input or existing library only).
- Version history/rollback (captured in later PRD).

## UX & Content Requirements
- Layout: three-column (navigation tree, canvas, inspector) with responsive collapse for smaller screens.
- Provide onboarding checklist or empty state with quick-start CTA.
- Support keyboard shortcuts for add section ("A"), save ("Cmd/Ctrl+S"), undo/redo (future).
- Ensure focus management when adding or reordering sections for accessibility.

## Technical Requirements
- Define `PageDefinition` schema (JSON) with sections array and metadata; align with backend DTOs.
- Extend NestJS `PagesService` to support draft vs published status, section ordering, and validation.
- Implement API endpoints: `GET /artists/:id/pages`, `POST /artists/:id/pages`, `PATCH /pages/:id`.
- Use Zod for frontend schema validation and type inference.
- Integrate shared renderer components from public site for preview parity.
- Store autosave timestamp and handle conflict resolution (last-writer-wins with warning banner).

## Dependencies
- Authenticated context from PRD-002.
- Assets endpoint (basic URL support now; full asset manager to be defined in future PRD).
- Design assets for section thumbnails and icons.

## Acceptance Criteria
- [ ] Artists can create, edit, reorder, and delete sections within a page.
- [ ] Changes persist via autosave and reflect after page refresh.
- [ ] Publish toggle updates page availability in public runtime (PRD-004 dependency).
- [ ] Drag-and-drop interactions support keyboard navigation and ARIA announcements.
- [ ] Unit/integration tests cover section CRUD and autosave flows.

## Instrumentation
- Track events: `builder.page_create`, `builder.section_add`, `builder.section_reorder`, `builder.publish`.
- Capture autosave duration and failure rates for observability dashboards.

## Timeline & Milestones
- **Data modeling & API extensions**: 4 days.
- **Frontend builder implementation**: 6 days.
- **Testing & polish**: 3 days (accessibility, performance, bug fixes).

## Revision History
| Date | Version | Author | Notes |
|------|---------|--------|-------|
| 2024-05-20 | 1.0 | Platform Team | Initial draft.
