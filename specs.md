# Caught Up — Product Requirements Document

## Project overview

Caught Up is a quiet, installable news-feed web app for people who want to follow only the subjects they deliberately chose—without recommendations, ads, push notifications, or an endless algorithmic feed.

Users follow supported topics, such as AI, politics, football, a specific club, people, companies, products, events, or organizations. Updates appear in one chronological main timeline and up to four user-selected topic tabs. If there is nothing new, the app simply communicates: “You’re caught up.”

Version 1 prioritizes a working RSS-based core. It displays entries from trusted, app-managed RSS feeds; automated major-news filtering, AI summaries, multi-source clustering, and X monitoring are deferred.

## Core requirements

- React-based, installable PWA supporting iPhone Safari, Android Chrome, and desktop Chrome.
- English-only at launch.
- Accessible to WCAG 2.1 AA.
- Accounts supported through verified email/password and Google sign-in.
- Password-reset flow delivered by email.
- Account deletion available from settings.
- Automatic regional detection; when a region change is detected, ask the user to confirm it.
- Users can follow unlimited supported topics.
- Users may search or type a topic. If no reliable app-managed coverage exists, the topic cannot be followed and the app suggests alternatives.
- Users may assign up to four followed topics to dedicated tabs, then manually reorder, delete, or replace those tabs.
- Main timeline shows all followed-topic updates in strict chronological order.
- A newly followed topic begins with future updates only; no historical feed backfill.
- Timeline entries remain visible for 24 hours.
- Searchable archive is retained indefinitely for topics the user currently follows.
- Saved items persist after timeline expiry and after a topic is unfollowed.
- When a topic is unfollowed, its non-saved entries no longer appear in search.
- Refresh feeds every five minutes while the app is open; fetch current data on app reopen.
- No background refresh while closed and no push notifications.
- New updates are indicated with an unread dot on the relevant tab and main timeline; no unread counts.
- An item is considered seen when it appears on screen.
- Offline access includes the latest loaded timelines and saved-item text.
- The app is free and ad-free in version 1.

## Core features

### Authentication and onboarding

- Register with email/password, verify the email, or sign in with Google.
- Reset forgotten passwords through an email link.
- Detect a user’s region and use it for regional topic recommendations and source priority.
- Let users choose suggested topics, search for topics, or enter a specific topic.
- Allow users to manage region, followed topics, tabs, account, and saved items.

### Topic following and tabs

- Follow unlimited supported topics.
- Validate typed topics against app-managed supported coverage.
- Explain unsupported topics and suggest related supported alternatives.
- Display all followed-topic updates in the Main Timeline.
- Allow a maximum of four manually selected and ordered topic tabs.
- Name each tab automatically after its topic.
- Show “You’re caught up” when a timeline has no unseen updates, including a newly created empty tab.

### RSS updates

- Monitor selected, trusted RSS feeds every five minutes.
- Trust sources based on established editorial reputation and a track record of accuracy.
- In version 1, display every new RSS item from a followed topic’s trusted feed.
- Treat the same original link as the same story to prevent exact duplicate ingestion.
- Show RSS-provided title and short description as the card content.
- Show the source name and provide a direct link to the original story.
- Show the time Caught Up fetched the item.
- If a source provides an image, show it in the detail view.
- Open original stories in the device browser.

### Feed and detail views

Timeline cards show:

- Title
- Short description
- Source name/link
- Fetch timestamp
- Save button

Opening a card shows available RSS details, source information, image, source link, and relevant topic labels.

An item relevant to multiple followed topics appears once in the Main Timeline and within each relevant topic tab. Topic labels appear in the detail view only.

### Saved items and search

- Save an item for later.
- Browse saved items separately from the timeline.
- Search supported topics to follow.
- Search indefinitely retained entries for currently followed topics.
- Search saved entries.
- Keep saved-item summaries available offline.

### Reporting and administration

- Let users report inaccurate, misleading, or broken items/links.
- Provide an internal admin tool to manage trusted sources, supported topics, topic-to-source mappings, and user reports.
- Let users view the trusted sources monitored for a topic, without allowing edits to the source list.

## Core components

| Component | Responsibility |
| --- | --- |
| React PWA | Responsive interface, onboarding, timelines, tabs, saved items, search, settings, and offline cache |
| Express API | Authentication, authorization, user settings, topic management, timeline/query APIs, reporting, and admin APIs |
| RSS ingestion worker | Polls configured feeds every five minutes, normalizes entries, avoids duplicate links, and stores new records |
| PostgreSQL database | Stores users, topics, source mappings, feed entries, follows, tabs, saved items, read state, reports, and region preferences |
| Admin interface | Manages sources, feed mappings, supported topics, and reports |
| Service worker | Enables installability and caches recently loaded timelines and saved-item summaries |
| Email service | Sends verification and password-reset emails |

## App/user flow

```text
Open app
  → Sign up / Sign in
  → Region detected
  → Choose suggested topics or search/type a topic
  → Follow valid topics
  → Main Timeline opens
      → View chronological updates from all followed topics
      → Save an item or open details
      → Open original source in browser
  → Choose up to four topic tabs
      → Reorder, replace, or remove tabs
  → Search
      → Find followed-topic updates, saved items, or supported topics
  → Settings
      → Manage topics, tabs, region confirmation, account, and deletion
```

## Techstack

### Frontend

- React
- TypeScript
- Vite
- `vite-plugin-pwa`
- Tailwind CSS
- React Router
- TanStack Query for API data fetching and caching
- IndexedDB or Cache Storage for offline timeline and saved-item caching
- Vercel deployment

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT-based authenticated sessions using secure HTTP-only cookies
- RSS parser library
- Scheduled worker using `node-cron` or an equivalent hosting scheduler
- Email provider for verification and password resets
- Render or Railway deployment

### Deferred technology

- X API integration
- AI providers
- Automated story clustering
- AI-written summaries
- Automated “major development” classification
- Push-notification infrastructure

## Implementation plan

1. Set up the backend repository: Node.js, Express, TypeScript, PostgreSQL, Prisma, environment configuration, and Render/Railway deployment.
2. Design and implement the database schema for users, authentication, regions, topics, trusted sources, RSS feeds, topic-source mappings, follows, tabs, entries, saved items, read state, and reports.
3. Implement authentication APIs: email/password registration, email verification, Google sign-in, password reset, logout, secure cookie sessions, protected routes, and account deletion.
4. Build internal admin APIs and tools to manage trusted sources, RSS feeds, supported topics, topic mappings, and user reports.
5. Build the RSS ingestion worker: five-minute polling, feed parsing, normalization, source attribution, link-based duplicate prevention, and PostgreSQL persistence.
6. Build backend APIs for supported-topic search and validation; following and unfollowing topics; managing the four topic tabs; main and topic-specific timelines; read state and unread-dot behavior; saved items; archive search; user reports; and region detection and confirmation.
7. Test and secure the backend: API tests, ingestion tests, validation, rate limiting, error handling, logging, and monitoring.
8. Set up the React/Vite PWA frontend and connect it to the stable backend APIs.
9. Build onboarding, authentication screens, timelines, tabs, details, search, saved items, settings, and admin screens.
10. Add offline caching, responsive behavior, accessibility, end-to-end testing, and production hardening.

## Later list

- X monitoring through the official X API once credentials/access are available
- AI-written summaries
- Clustering several sources into one story
- Significant-development filtering instead of displaying every RSS entry
- Conflict/uncertainty summaries across sources
- Source-correction labels
- Push notifications
- Additional languages
- Additional desktop-browser support
