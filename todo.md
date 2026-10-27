# Caught Up - Detailed Build Plan

Dependency notation:

- **Depends on:** tasks that must finish first.
- **Feeds into:** tasks that use this work.
- The final release task depends on all delivery-critical work, so no task is orphaned.

## 1. Foundation and delivery setup

- [x] **1.1 Create the monorepo structure** - Create separate `apps/api`, `apps/web`, and shared configuration folders. Add root package management, TypeScript configuration, linting, formatting, editor settings, and environment-file examples.  
  **Depends on:** None.  
  **Feeds into:** 1.2, 1.3, 1.4, 2.1, 8.1.

- [x] **1.2 Configure backend runtime** - Initialize the Express/TypeScript API with application startup, health-check endpoint, centralized configuration validation, structured error responses, and request logging.  
  **Depends on:** 1.1.  
  **Feeds into:** 2.1, 3.1, 4.1, 5.1, 6.1, 10.1.

- [ ] **1.3 Configure quality automation** - Add ESLint, Prettier, unit-test tooling, pre-commit checks, and CI that installs dependencies, type-checks, lints, and runs tests.  
  **Depends on:** 1.1.  
  **Feeds into:** 11.1, 11.2, 12.1.

- [ ] **1.4 Create environment and secret-management conventions** - Define documented environment variables for database access, session secrets, Google OAuth, email delivery, RSS worker settings, and deployment URLs. Do not commit secrets.  
  **Depends on:** 1.1.  
  **Feeds into:** 2.1, 3.3, 4.2, 5.2, 10.2, 12.1.

## 2. Database and persistence layer

- [ ] **2.1 Provision PostgreSQL and Prisma** - Connect the API to PostgreSQL, configure Prisma migrations, and add local-development database instructions.  
  **Depends on:** 1.2, 1.4.  
  **Feeds into:** 2.2, 2.3, 2.4, 2.5, 2.6.

- [ ] **2.2 Create identity and account models** - Add database models for users, password credentials, email-verification tokens, password-reset tokens, OAuth identities, sessions, and user deletion status.  
  **Depends on:** 2.1.  
  **Feeds into:** 3.1, 3.2, 3.3, 3.4.

- [ ] **2.3 Create content-catalog models** - Add models for topics, trusted sources, RSS feeds, topic-to-feed mappings, regions, and regional source priority. Include uniqueness constraints and indexes.  
  **Depends on:** 2.1.  
  **Feeds into:** 4.1, 4.2, 5.1, 6.1.

- [ ] **2.4 Create feed-entry models** - Add models for normalized RSS entries, original links, source metadata, timestamps, optional images, and topic associations. Ensure original links can be used for duplicate prevention.  
  **Depends on:** 2.1, 2.3.  
  **Feeds into:** 5.2, 5.3, 6.2, 6.3, 7.2.

- [ ] **2.5 Create user-content models** - Add follows, selected tabs, tab ordering, saved items, seen/read state, reports, and user-region confirmation models.  
  **Depends on:** 2.1, 2.2, 2.3, 2.4.  
  **Feeds into:** 6.1, 6.2, 6.3, 6.4, 6.5, 7.1.

- [ ] **2.6 Seed development data** - Add repeatable seed data for initial regions, supported topics, trusted sources, RSS feeds, and topic mappings.  
  **Depends on:** 2.3.  
  **Feeds into:** 4.3, 5.4, 6.1, 8.4, 11.2.

## 3. Authentication and account APIs

- [ ] **3.1 Implement email/password registration** - Create registration validation, secure password hashing, duplicate-email handling, and user creation.  
  **Depends on:** 2.2.  
  **Feeds into:** 3.2, 3.5, 8.2.

- [ ] **3.2 Implement email verification** - Generate expiring verification tokens, send verification emails, verify accounts, and prevent unverified accounts from using protected application functionality.  
  **Depends on:** 2.2, 3.1, 4.2.  
  **Feeds into:** 3.5, 8.2.

- [ ] **3.3 Implement Google sign-in** - Configure Google OAuth, safely create or link identities, and return an authenticated session.  
  **Depends on:** 2.2, 1.4.  
  **Feeds into:** 3.5, 8.2.

- [ ] **3.4 Implement password reset and account deletion** - Build reset-token issuance, password update, session invalidation, and a user-initiated account deletion flow.  
  **Depends on:** 2.2, 4.2.  
  **Feeds into:** 3.5, 8.2, 11.2.

- [ ] **3.5 Implement secure session middleware** - Use secure HTTP-only cookies, authentication middleware, logout, session expiry, and authorization helpers for user and admin routes.  
  **Depends on:** 3.1, 3.2, 3.3, 3.4.  
  **Feeds into:** 4.1, 6.1, 6.2, 6.3, 6.4, 6.5, 8.3.

## 4. Admin and source-catalog backend

- [ ] **4.1 Add admin authorization** - Define the admin role and protect admin-only API routes using authorization middleware.  
  **Depends on:** 2.2, 3.5.  
  **Feeds into:** 4.3, 4.4, 8.7.

- [ ] **4.2 Integrate transactional email delivery** - Implement a reusable email service, templates for verification and reset messages, retry/error handling, and local-development email behavior.  
  **Depends on:** 1.4.  
  **Feeds into:** 3.2, 3.4, 11.2.

- [ ] **4.3 Build source and RSS-feed admin APIs** - Create validated CRUD endpoints for trusted sources and their RSS feed URLs. Test feed URL validity before activation.  
  **Depends on:** 2.3, 2.6, 4.1.  
  **Feeds into:** 4.5, 5.1, 8.7.

- [ ] **4.4 Build topic and mapping admin APIs** - Create admin APIs to manage supported topics, regions, source priorities, and topic-to-feed mappings.  
  **Depends on:** 2.3, 2.6, 4.1.  
  **Feeds into:** 4.5, 6.1, 8.7.

- [ ] **4.5 Build report-review admin APIs** - Let admins list, inspect, update, and resolve user reports without exposing reporter details unnecessarily.  
  **Depends on:** 2.5, 4.1.  
  **Feeds into:** 8.7, 11.2.

## 5. RSS ingestion pipeline

- [ ] **5.1 Create the feed polling scheduler** - Run a backend job every five minutes, select active configured feeds, record run status, and prevent overlapping executions.  
  **Depends on:** 1.2, 2.3, 4.3.  
  **Feeds into:** 5.2, 10.3, 11.2.

- [ ] **5.2 Parse and normalize RSS items** - Fetch RSS XML safely, extract title, description, original link, publication metadata, source name, and available image data into a consistent internal format.  
  **Depends on:** 2.4, 5.1.  
  **Feeds into:** 5.3.

- [ ] **5.3 Persist entries and prevent duplicate links** - Store normalized feed entries, associate them with mapped topics, and reject an entry when its original link already exists for the source/story.  
  **Depends on:** 2.4, 2.5, 5.2.  
  **Feeds into:** 5.4, 6.2, 6.3, 7.2.

- [ ] **5.4 Add ingestion observability** - Record feed failures, malformed content, entry counts, last successful refresh, and retryable errors for admin visibility and operational monitoring.  
  **Depends on:** 5.1, 5.3.  
  **Feeds into:** 8.7, 10.3, 11.2.

## 6. User-facing backend APIs

- [ ] **6.1 Build topic discovery and follow APIs** - Support regional topic suggestions, supported-topic search, free-text validation, alternative suggestions, follow, unfollow, and trusted-source listing. Do not allow unsupported topics to be followed.  
  **Depends on:** 2.3, 2.5, 3.5, 4.4.  
  **Feeds into:** 7.1, 8.4, 8.5.

- [ ] **6.2 Build timeline APIs** - Return the Main Timeline and topic timelines in strict newest-first chronological order. Restrict content to followed topics, expose only the previous 24 hours in timelines, and return caught-up metadata.  
  **Depends on:** 2.4, 2.5, 3.5, 5.3, 6.1.  
  **Feeds into:** 7.2, 8.5.

- [ ] **6.3 Build seen-state and unread-indicator APIs** - Mark entries as seen when the client reports they appeared on screen. Return whether the main timeline and each topic tab have unseen entries, without numeric counts.  
  **Depends on:** 2.5, 3.5, 5.3, 6.2.  
  **Feeds into:** 7.2, 8.5.

- [ ] **6.4 Build saved-items and archive-search APIs** - Save and unsave entries, return saved items indefinitely, and search the retained archive only for topics the user currently follows. Preserve saved items after an unfollow.  
  **Depends on:** 2.4, 2.5, 3.5, 6.1.  
  **Feeds into:** 7.3, 8.6.

- [ ] **6.5 Build settings and report APIs** - Support region confirmation, topic-tab selection and ordering, update reporting, and account settings. Enforce a four-tab maximum.  
  **Depends on:** 2.5, 3.5, 6.1.  
  **Feeds into:** 7.1, 7.4, 8.8.

## 7. Backend hardening

- [ ] **7.1 Validate API contracts and permissions** - Add schema validation, ownership checks, pagination, secure error messages, and consistent API response contracts for account, topic, tab, and settings APIs.  
  **Depends on:** 6.1, 6.5.  
  **Feeds into:** 8.4, 8.8, 11.1.

- [ ] **7.2 Harden timeline behavior** - Add indexed queries, pagination/cursors, 24-hour expiry handling, read-state correctness, and tests for multi-topic feed behavior.  
  **Depends on:** 6.2, 6.3.  
  **Feeds into:** 8.5, 11.1.

- [ ] **7.3 Harden saved/search behavior** - Add full-text search indexes, authorization checks, saved-item persistence tests, and unfollow/archive visibility tests.  
  **Depends on:** 6.4.  
  **Feeds into:** 8.6, 11.1.

- [ ] **7.4 Add API protection and operational controls** - Add rate limiting, CORS configuration, security headers, request IDs, audit logs for admin actions, and health/readiness checks.  
  **Depends on:** 1.2, 4.5, 5.4, 6.5.  
  **Feeds into:** 10.1, 10.3, 11.2.

## 8. Frontend PWA

- [ ] **8.1 Initialize the React application** - Create the React/Vite/TypeScript application, Tailwind setup, routing, API client, environment configuration, and shared UI primitives.  
  **Depends on:** 1.1.  
  **Feeds into:** 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8.

- [ ] **8.2 Build authentication screens** - Implement registration, verification, Google sign-in, login, password reset, logout, protected routes, and accessible error/success states.  
  **Depends on:** 3.5, 8.1.  
  **Feeds into:** 8.4, 8.5, 8.6, 8.8.

- [ ] **8.3 Add PWA installation and offline foundation** - Configure the manifest, service worker, install metadata, and offline fallback behavior without showing custom install prompts.  
  **Depends on:** 8.1.  
  **Feeds into:** 8.9, 11.3.

- [ ] **8.4 Build onboarding and topic management** - Implement region detection/confirmation, recommendations, topic search, typed-topic validation, follow/unfollow flows, supported-alternative messaging, and source-list viewing.  
  **Depends on:** 6.1, 7.1, 8.1, 8.2.  
  **Feeds into:** 8.5, 8.8, 11.3.

- [ ] **8.5 Build timelines and topic tabs** - Implement Main Timeline, four-tab selection/reordering, chronological cards, caught-up states, unread dots, card detail screens, direct source links, and seen-state reporting on viewport entry.  
  **Depends on:** 6.2, 6.3, 7.2, 8.1, 8.2, 8.4.  
  **Feeds into:** 8.9, 11.3.

- [ ] **8.6 Build saved items and search** - Implement save/unsave controls, Saved Items, archive search, supported-topic search, empty states, and error states.  
  **Depends on:** 6.4, 7.3, 8.1, 8.2.  
  **Feeds into:** 8.9, 11.3.

- [ ] **8.7 Build the admin interface** - Build protected admin screens for sources, RSS feeds, topics, topic mappings, and report review.  
  **Depends on:** 4.3, 4.4, 4.5, 8.1, 8.2.  
  **Feeds into:** 11.3.

- [ ] **8.8 Build settings and reporting screens** - Implement region confirmation, account deletion, tab management, and item reporting interfaces.  
  **Depends on:** 6.5, 7.1, 8.1, 8.2, 8.4.  
  **Feeds into:** 11.3.

- [ ] **8.9 Implement client offline caching** - Cache recently loaded timeline responses and saved-item summaries. Clearly identify offline status and preserve source-link behavior for when connectivity returns.  
  **Depends on:** 8.3, 8.5, 8.6.  
  **Feeds into:** 11.3.

## 9. Accessibility and product quality

- [ ] **9.1 Audit accessible interaction patterns** - Ensure keyboard navigation, semantic landmarks, focus handling, touch target sizes, contrast, readable typography, and screen-reader labels meet WCAG 2.1 AA.  
  **Depends on:** 8.2, 8.4, 8.5, 8.6, 8.7, 8.8.  
  **Feeds into:** 11.3.

- [ ] **9.2 Validate responsive layouts** - Test and refine layouts for iPhone Safari, Android Chrome, and desktop Chrome, including tabs, timelines, forms, admin screens, and offline states.  
  **Depends on:** 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9.  
  **Feeds into:** 11.3.

## 10. Deployment and operations

- [ ] **10.1 Deploy the API and database** - Deploy Express to Render or Railway, provision managed PostgreSQL, run migrations safely, configure production environment variables, and expose health checks.  
  **Depends on:** 1.2, 2.1, 7.4.  
  **Feeds into:** 10.3, 11.3.

- [ ] **10.2 Deploy the frontend** - Deploy the Vite PWA to Vercel, configure API origins, secure cookies, OAuth callback URLs, and production environment variables.  
  **Depends on:** 8.1, 8.3, 10.1.  
  **Feeds into:** 11.3.

- [ ] **10.3 Schedule and monitor RSS ingestion in production** - Configure the five-minute production scheduler, validate active feeds, create failure alerts, and document recovery procedures.  
  **Depends on:** 5.4, 7.4, 10.1.  
  **Feeds into:** 11.2, 11.3.

## 11. Verification and release

- [ ] **11.1 Complete backend test coverage** - Add unit and integration tests for authentication, authorization, topic validation, timeline rules, saved items, search, reports, and API validation.  
  **Depends on:** 3.5, 7.1, 7.2, 7.3.  
  **Feeds into:** 11.3.

- [ ] **11.2 Complete ingestion and operations testing** - Test valid feeds, malformed feeds, network failures, retry behavior, duplicate links, scheduler overlap prevention, email delivery, backups, and recovery procedures.  
  **Depends on:** 3.4, 5.4, 7.4, 10.3.  
  **Feeds into:** 11.3.

- [ ] **11.3 Run end-to-end acceptance testing** - Test the complete user journey on required browsers: sign-up, topic following, feed ingestion, timelines, tabs, unread dots, saving, search, reporting, offline use, account deletion, and admin management.  
  **Depends on:** 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9.1, 9.2, 10.1, 10.2, 11.1, 11.2.  
  **Feeds into:** 12.1.

## 12. Launch

- [ ] **12.1 Complete production launch checklist** - Confirm CI is green, migrations are applied, initial trusted feeds are configured, monitoring is active, legal/privacy content is available, rollback instructions are documented, and production smoke tests pass.  
  **Depends on:** 1.3, 1.4, 10.1, 10.2, 11.3.  
  **Feeds into:** Project completion.
