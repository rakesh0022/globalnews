# NewsHub — Project Architecture

## Folder Structure

```
newshub/
├── app/                        # Next.js App Router — routes, layouts, pages
│   ├── api/
│   │   └── news/
│   │       ├── route.ts        # GET /api/news  — proxies NewsAPI, falls back to mock
│   │       └── [id]/
│   │           └── route.ts    # GET /api/news/:id
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx        # Article detail page (SSR + JSON-LD)
│   ├── search/
│   │   ├── page.tsx            # /search route (SSR shell + Suspense)
│   │   └── SearchResults.tsx   # Client component — full search results page
│   ├── globals.css             # Global styles, Tailwind import, shimmer keyframe
│   ├── layout.tsx              # Root layout — fonts, metadata, Navbar, Footer
│   ├── not-found.tsx           # 404 page
│   ├── page.tsx                # Homepage — hero, category tabs, grid, sidebar
│   └── theme-script.ts         # Blocking script injected in <head> to prevent FOUC
│
├── components/                 # All React UI components, grouped by domain
│   ├── article/                # Components used only on the article detail page
│   │   ├── ArticleBody.tsx     # Renders paragraphs + pull-quote detection
│   │   ├── ReadingProgress.tsx # Fixed progress bar driven by scroll position
│   │   └── ShareButtons.tsx    # X, Facebook, LinkedIn, copy-link, native share
│   ├── layout/                 # App-wide structural components
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx          # Sticky nav with search, theme toggle, mobile menu
│   ├── news/                   # News-specific display components
│   │   ├── CategoryFilter.tsx  # Pill-style category buttons (legacy, kept for compat)
│   │   ├── CategoryTabs.tsx    # Underline tab bar with emoji icons
│   │   ├── HeroCard.tsx        # Single full-width hero card (legacy)
│   │   ├── HeroSection.tsx     # 12-col editorial hero grid (main + 3 secondary)
│   │   ├── NewsCard.tsx        # Reusable card — vertical or horizontal variant
│   │   ├── NewsCardWide.tsx    # Horizontal featured card (wraps NewsCard)
│   │   ├── NewsGrid.tsx        # 4-col responsive grid with load-more + error state
│   │   ├── NewsletterWidget.tsx # Email signup card in sidebar
│   │   └── TrendingList.tsx    # Numbered trending articles list for sidebar
│   └── ui/                     # Generic, domain-agnostic UI primitives
│       ├── CategoryBadge.tsx   # Coloured pill badge for article categories
│       ├── SearchBar.tsx       # Controlled input with debounce + dropdown
│       ├── SearchDropdown.tsx  # Inline search results panel with highlight
│       ├── SkeletonCard.tsx    # Shimmer skeletons for every card/layout shape
│       └── ThemeToggle.tsx     # Animated pill switch for dark/light mode
│
├── hooks/                      # Custom React hooks — all client-side state logic
│   ├── useNews.ts              # Paginated news fetching with abort + retry
│   ├── useSearch.ts            # Debounced search with AbortController
│   └── useTheme.ts             # Dark/light mode with localStorage persistence
│
├── lib/                        # Pure utilities and data — no React, no side effects
│   ├── mock-data.ts            # 12 realistic seed articles (fallback dataset)
│   ├── newsapi.ts              # Raw NewsAPI.org HTTP client (server-only)
│   └── utils.ts                # formatDate, formatFullDate, truncate, category maps
│
├── services/
│   └── api/                    # Async data-access layer — called by hooks and pages
│       ├── mockService.ts      # Mock data service (filter, paginate, lookup)
│       └── newsService.ts      # Client-safe service — calls /api/news route handlers
│
├── types/
│   └── index.ts                # Shared TypeScript types: Article, Category, etc.
│
├── public/                     # Static assets served at root (SVGs, favicons)
├── assets/                     # Source assets (icons, images) — not yet populated
├── utils/                      # Reserved for future pure utility modules
│
├── .env.local                  # NEWS_API_KEY (gitignored)
├── next.config.ts              # Image remote patterns (Unsplash)
├── postcss.config.mjs          # Tailwind CSS v4 PostCSS plugin
├── tailwind.config.ts          # (Tailwind v4 — config lives in CSS, not here)
└── tsconfig.json               # Strict mode, @/* path alias
```

---

## Folder Purposes

### `app/`
Next.js App Router. Every folder is a URL segment. Contains only route files
(`page.tsx`, `layout.tsx`, `route.ts`) and their co-located server/client
components. No reusable UI lives here — it belongs in `components/`.

### `app/api/`
Next.js Route Handlers. Run server-side only. The `/api/news` handler proxies
NewsAPI.org, keeping the API key off the client. Falls back to mock data
automatically when no key is configured.

### `components/`
All React components, split into three sub-folders:

| Sub-folder | Rule |
|---|---|
| `layout/` | Rendered on every page (Navbar, Footer) |
| `news/` | Domain-specific — only used in news contexts |
| `ui/` | Generic primitives reusable anywhere (Badge, Skeleton, SearchBar) |

### `hooks/`
Custom hooks encapsulate all async state logic. Components stay thin — they
call a hook and render the result. Each hook owns its own loading, error, and
abort lifecycle.

### `lib/`
Pure functions and static data. Nothing in `lib/` imports React or has side
effects. Safe to import from both server and client code, except `newsapi.ts`
which is server-only (it reads `process.env.NEWS_API_KEY`).

### `services/api/`
The data-access layer. Hooks call services; services call either the Route
Handler (`newsService.ts`) or the mock store (`mockService.ts`). This
indirection means swapping the data source requires changing only one file.

### `types/`
Single source of truth for shared TypeScript interfaces. Imported everywhere —
no inline type definitions scattered across files.

### `public/`
Static files served verbatim at the root URL. Favicons, OG images, and any
assets that need a stable public URL go here.

### `assets/`
Source assets (SVGs, raw images) that may be processed by the build. Currently
empty — add icons and images here as the project grows.

### `utils/`
Reserved for future pure utility modules that don't fit in `lib/` (e.g.
analytics helpers, string formatters specific to a feature).

---

## Data Flow

```
User interaction
  └── Component
        └── Hook (useNews / useSearch)
              └── Service (newsService.ts)          ← client-safe
                    └── Route Handler (/api/news)   ← server-only
                          ├── newsapi.ts            ← NewsAPI.org (live)
                          └── mockService.ts        ← fallback
```

## Key Conventions

- `"use client"` only on components/hooks that need browser APIs or state.
  Pages and layouts are Server Components by default.
- Route Handlers never import from `components/` or `hooks/`.
- `lib/newsapi.ts` is never imported from client components — it would expose
  the API key. Only Route Handlers import it.
- All async data fetching uses `async/await` with explicit error handling.
  No unhandled promise rejections.
- Path alias `@/` maps to the project root, so imports are always absolute.
