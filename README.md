# World Sports Hub

A browsable catalog of the world's sports — **leagues, teams, logos, players,
and live/upcoming events** — built as a single-page React app that pulls free,
community-maintained data from [TheSportsDB](https://www.thesportsdb.com).

> Data coverage varies by sport. TheSportsDB is strongest on global soccer,
> the major US leagues (NBA, NFL, MLB, NHL, MLS), and premier international
> series (F1, UFC, IPL, rugby). Niche sports may have limited data on the free
> tier.

## Features

- Browse every sport available on TheSportsDB with thumbnails and descriptions
- Drill into each sport → every league (filterable by country)
- League pages with badge, founding year, trophies, squads, upcoming fixtures,
  and recent results
- Team pages with logos, stadium info, rosters, and upcoming/past fixtures
- Player pages with headshot, bio, stats, and team linkage
- A global "Upcoming events" page spanning major leagues across sports
- Global search (teams + events)

## Tech stack

- [Vite](https://vitejs.dev/) + React 19 + TypeScript
- [React Router](https://reactrouter.com/) (HTML5 routing)
- [TanStack Query](https://tanstack.com/query) (data fetching + in-memory cache)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TheSportsDB v1 JSON API](https://www.thesportsdb.com/documentation) (free
  key `123` by default; override with `VITE_SPORTSDB_KEY` for a premium key)

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

To build for production:

```bash
npm run build
npm run preview
```

## Configuration

Create a `.env.local` if you want to use a premium TheSportsDB key:

```
VITE_SPORTSDB_KEY=your_premium_key
```

With the free key (`123`), some high-volume endpoints (e.g. player search, live
scores, video highlights) are rate-limited or unavailable. The app gracefully
degrades to the endpoints that do work on the free tier.

## Project layout

```
src/
  lib/api.ts               # TheSportsDB client + types
  components/              # Layout, image fallback, event lists, states
  pages/
    SportsPage.tsx         # /            → all sports
    SportPage.tsx          # /sports/:s   → leagues in a sport
    LeaguePage.tsx         # /leagues/:id → league + teams + fixtures
    TeamPage.tsx           # /teams/:id   → team + squad + fixtures
    PlayerPage.tsx         # /players/:id → player bio
    EventsPage.tsx         # /events      → upcoming events worldwide
    SearchPage.tsx         # /search?q=…  → unified search
  App.tsx                  # router + query client
```

## Attribution

All team/league/player artwork, logos, and metadata are © their respective
owners, served via TheSportsDB. Please consult
[TheSportsDB's terms](https://www.thesportsdb.com/docs_terms_of_use.php)
before redistributing.
