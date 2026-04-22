# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for Fish the Wahoo, a Charleston based deep sea fishing trip booking service with partnerships with over 15 captains and boats in Charleston to book visitors and fishing enthusiasts on the best boats available. We charge a deposit amount, and the final amount is charged to the customer via the boat or captain who accepts the trip. 

Trips are sold in 1/2 day (6 hour), 3/4 day (8 hour), and full day (10-12 hour) trips. Trips can be booked on any day, 1/2 day trips can be booked for 6am or 12pm leave times, all other trips leave at 5am or 6am.  

## Orientation

[PROGRESS.md](PROGRESS.md) is the authoritative source for current build status, blockers, seeded pricing, deploy settings, and remaining work. Read it before making architectural decisions.

## Commands

```bash
npm run dev                # Vite dev server at http://localhost:5173
npm run build              # Regenerates _redirects then builds to dist/
npm run build:redirects    # Regenerate public/_redirects from src/data/redirects.ts
npm run preview            # Preview production build
npm run typecheck          # tsc --noEmit -p tsconfig.app.json
npm run lint               # ESLint (flat config, TS + react-hooks + react-refresh)
npm run import-wp          # Fetch WP posts to content/blog/*.md + public/blog-images/
```

No test runner is configured. Before claiming work is complete, run `npm run typecheck && npm run lint`.

### Supabase CLI

```bash
supabase link --project-ref cidzchicqmcdpymgxhbm
supabase db push
supabase functions deploy create-payment-intent
supabase functions deploy notify-captain
supabase secrets set STRIPE_SECRET_KEY=...
supabase secrets set POSTMARK_SERVER_TOKEN=...
```

Project ref `cidzchicqmcdpymgxhbm` is also wired into [.mcp.json](.mcp.json) so the Supabase MCP server is scoped to this project.

## Architecture

### Stack

Vite + React 18 + TypeScript (strict, `noUnusedLocals`, `noUnusedParameters`), React Router v7, Tailwind CSS, Supabase (Postgres + Auth + Edge Functions), Stripe for deposits, Postmark for captain notification email, Cloudflare Pages for hosting.

### Routing model

[src/App.tsx](src/App.tsx) is a single flat `<Routes>` tree containing every route, including client-side navigations for legacy WordPress URLs. Server-side 301s are served by [public/_redirects](public/_redirects) when deployed to Cloudflare Pages.

The redirect map has a single source of truth: [src/data/redirects.ts](src/data/redirects.ts). `public/_redirects` is regenerated from it at build time via [scripts/build-redirects.ts](scripts/build-redirects.ts) (runs automatically as part of `npm run build`). To add a legacy redirect, edit `redirects.ts` and rerun the build. Do not hand-edit `public/_redirects`.

### Booking flow

`/book` redirects to `/book/calendar`. [src/pages/BookCalendar.tsx](src/pages/BookCalendar.tsx) is the primary booking surface (calendar-first).

The older multi-step wizard at [src/pages/BookCharter.tsx](src/pages/BookCharter.tsx) and its step components in [src/components/booking/](src/components/booking/) are confirmed dead code (no route imports them, no other page imports the steps). They can be deleted when convenient.

### Admin

`/admin/*` is guarded by [src/components/layout/AdminLayout.tsx](src/components/layout/AdminLayout.tsx) which checks Supabase auth. Admin users are created via the Supabase dashboard (Authentication > Users > Invite User). There is no self-signup.

### Content: static vs database

Three different sources feed pages:

1. Typed TS arrays in [src/content/](src/content/) — `packages.ts`, `species.ts`, `boats.ts`, `gallery.ts`. Edit these for copy changes to package/species/boat detail pages.
2. Supabase tables — bookings, captains, availability, pricing, boat_classes, trip_videos. Schema in [supabase/migrations/](supabase/migrations/), seed in [supabase/seed.sql](supabase/seed.sql).
3. Markdown blog posts under `content/blog/*.md`, loaded at build time via `import.meta.glob('/content/blog/*.md')` in [src/lib/blog.ts](src/lib/blog.ts). Populated by `npm run import-wp`. No CMS.

Packages are hybrid: each static `packages.ts` entry carries copy and a `boatClassIndex` (0/1/2) that [src/pages/PackageDetail.tsx](src/pages/PackageDetail.tsx) uses to fetch the current hero image from the `boat_classes` Supabase table. Update images in Supabase, not in the TS file.

### Supabase edge functions

[supabase/functions/create-payment-intent/](supabase/functions/create-payment-intent/) charges the Stripe deposit. [supabase/functions/notify-captain/](supabase/functions/notify-captain/) sends the assignment email via Postmark. Both require secrets set via `supabase secrets set`.

### Money

Prices and deposits are stored and transmitted as integer cents. [src/lib/format.ts](src/lib/format.ts) has `formatCents` for display. Never store or compare floats.

### Design system

Dark nautical theme defined in [tailwind.config.js](tailwind.config.js): colors `nautical-dark` `#0a192f`, `nautical-blue` `#112240`, `nautical-light` `#233554`, `accent-orange` `#f97316`, `accent-gold` `#fbbf24`. Fonts: Space Grotesk (display), Inter (body). Keep new UI consistent with these tokens.

## Deploy

Cloudflare Pages. Build command `npm install && npm run build`, output directory `dist`. Required env vars on the CF Pages project: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Supabase credentials for local dev live in [.env](.env) (gitignored).

## Gotchas

- `.bolt/` is scaffolding from Bolt.new and is safe to ignore.
- The blog loader keys on the absolute Vite path `/content/blog/*.md`, so the `content/` directory must live at the repo root.
- `scripts/build-sitemap.ts` is referenced in PROGRESS.md but does not exist yet. `public/sitemap.xml` must be generated before launch.
- Legacy numeric URLs like `/7716`, `/82016`, `/125-1221` are real redirects in `redirects.ts` (old WP daily-catch post slugs). Do not treat them as typos.
