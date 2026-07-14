# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ideas Archive** is a modern archive and explorer for application ideas from the Slack channel `#cron-idees-apps`. It's a static React 19 + TypeScript application built with Vite, styled with Astryx (Meta's design system), and deployed to GitHub Pages.

The project has two data sources:
- **Idées du matin** (`idees-matin`): Global application ideas from the community channel
- **Self-Improving** (`self-improving`): Madagascar-focused ideas generated weekly

## Quick Start

```bash
npm install              # Install dependencies
npm run dev             # Start Vite dev server (http://localhost:5173)
npm run build           # Build production (copies data/, runs tsc, then vite build)
npm run preview         # Preview production build locally
npm run astryx          # Astryx CLI (for design system inspection)
```

**Key Build Step**: The build command first copies the `data/` directory to `public/data/` so monthly JSON files are served statically. TypeScript is checked with `tsc -b` before Vite bundling.

**Deployment**: Commits to `main` trigger GitHub Actions → builds → deploys to GitHub Pages at `https://angelolockdev.github.io/ideas-archive/`

## Architecture

### Data Flow

1. **Data Source** → Monthly JSON files in `data/` (e.g., `2026-07.json`)
   - Structure: `{ month, updated_at, ideas[] }`
   - Each idea has: `id, title, description, problem, market, revenue, stack, difficulty, source, region, category, date, status, theme, keyword, why_now, mvp_plan`

2. **Slack Ingestion** (external, via Hermes cron)
   - **Archive Script** (`scripts/archive-ideas.py`): Parses Slack messages in `#cron-idees-apps`, extracts structured ideas, updates monthly JSON files, commits to GitHub
   - Two message formats parsed:
     - "Idées d'application du matin": Global ideas with emoji-delimited sections (Nom, Description, Problème, Marché, Revenus, Stack, Difficulté)
     - "Idées Matinales Self-Improving": Madagascar ideas with different emoji structure (Theme, Mot-clé, Problème, Solution, Stack, Monétisation, Pourquoi maintenant, MVP)

3. **React App** (`src/App.tsx` is the main container)
   - Loads the generated `data/index.json` manifest, then fetches all declared month files in parallel
   - `scripts/sync-data.mjs` copies `data/` to `public/data/` and regenerates the manifest before dev and production builds
   - Manages all state: ideas list, filter state, starred status (persisted to localStorage as `ia-stars`)
   - Passes filtered data to child components

4. **User Interactions**
   - Filter by month, category, region, source, or search text
   - Toggle "★ Meilleures" to show only starred ideas
   - Star/unstar individual ideas (stored in localStorage)
   - Ask questions to the AI agent (local Q&A, no backend calls)

### Component Architecture

```
App.tsx (main container + state management)
├── NavBar: Sticky header with logo and GitHub link
├── HeroSection: Title + subtitle with gradient
├── StatsBar: 4 cards showing total/starred/Madagascar/Global counts
├── FilterBar: Dropdowns (month, category, region, source) + search + "best only" toggle
├── IdeaGrid: Groups ideas by month, renders IdeaCard per idea
│   └── IdeaCard: Expandable card with star button, badges (category/region/source), metadata
└── AgentChat: Floating widget with toggle button, message history, input
    └── Smart Q&A matching (no external API): categories, stats, search, help
```

### Styling & Theme

- **Design System**: Astryx (Meta) via `@astryxdesign/core` + `@astryxdesign/theme-neutral`
- **CSS Imports** (`src/styles/global.css`):
  1. Astryx reset + base styles
  2. Neutral theme tokens (colors, spacing, radius, typography)
  3. Custom overrides (max-width, scrollbar, animations, chat layout)
- **CSS Variables**: All colors/spacing are Astryx tokens (e.g., `--color-accent`, `--color-border`, `--radius-container`)
- **Responsive**: Mobile-first. Chat container adapts on <768px.

### Type Safety

- **TypeScript strict mode** enabled (no `noUnusedLocals` or `noUnusedParameters` warnings to keep code clean)
- Core types in `src/types.ts`:
  - `Idea`: Full idea structure with all fields
  - `Category`: Union type ('productivity' | 'ai' | 'fintech' | ... | 'other')
  - `MonthlyData`: Monthly file structure
  - Category metadata: `CATEGORIES` (display names), `CAT_COLORS` (hex colors), `CAT_ICONS` (emoji), `MONTHS_FR` (French month names)

## Data Schema

Each idea object contains:

```typescript
interface Idea {
  id: string                    // Format: "20260705-mentoria" (YYYYMMDD-title-slug)
  title: string
  description: string          // Core solution/description
  problem: string              // Problem statement
  market: string               // Target market (if global)
  revenue: string              // Revenue model
  stack: string                // Tech stack
  difficulty: number | null    // 1-5 scale (if from idées-matin)
  source: 'idees-matin' | 'self-improving'
  region: 'global' | 'madagascar'
  category: Category            // Auto-inferred by script; can be manually edited
  date: string                  // YYYY-MM-DD
  status: 'pending' | 'starred' // User-set; persisted to localStorage
  
  // Self-improving only (optional):
  theme?: string               // Project theme/domain
  keyword?: string             // Single keyword
  why_now?: string             // Timing/market readiness
  mvp_plan?: string            // MVP specification
}
```

## Key Implementation Details

### Data Loading & State Management

- App loads the generated `data/index.json` manifest on mount, then fetches its monthly files in parallel
- Failed monthly fetches are skipped so a single corrupt archive does not hide the remaining data
- Starred status is restored from localStorage on load
- Filtering is real-time as user interacts with UI (no server calls)

### Filtering Logic (App.tsx)

```typescript
const filtered = ideas.filter(i => {
  if (monthFilter !== 'all' && i.date.substring(0, 7) !== monthFilter) return false
  if (catFilter !== 'all' && i.category !== catFilter) return false
  if (regionFilter !== 'all' && i.region !== regionFilter) return false
  if (sourceFilter !== 'all' && i.source !== sourceFilter) return false
  if (bestOnly && i.status !== 'starred') return false
  if (searchQuery) {
    const haystack = [i.title, i.description, i.problem, i.market, i.stack, i.theme]
      .filter(Boolean).join(' ').toLowerCase()
    if (!haystack.includes(searchQuery.toLowerCase())) return false
  }
  return true
})
```

Search is case-insensitive substring matching across title, description, problem, market, stack, and theme.

### Agent Chat Q&A

`AgentChat.tsx` implements local-only Q&A using a `findAnswer()` function that:
1. Detects user intent via keyword matching (categories, stars, stats, help, or keyword search)
2. Returns formatted markdown responses (bold text, bullet lists, stats)
3. Filters ideas in memory (no API calls)
4. Limits results to 5 items with "... and N more" fallback

Intent patterns:
- "catégorie/categories" → list all categories with counts
- "meilleur/coup de cœur/star" → list starred ideas
- "combien/nombre/stats" → show aggregate statistics
- Keyword search: extract words >3 chars, exclude stop words, match against idea text
- "aide/help/bonjour" → show help message
- Default: suggest filtering options

### Star Persistence

Stars are stored in localStorage as `ia-stars` (JSON array of idea IDs). On load, the App restores starred status by finding each stored ID in the ideas list and setting `status: 'starred'`. When user toggles a star, the new starred IDs list is immediately persisted.

### Category Auto-Inference

The archive script (`scripts/archive-ideas.py`) auto-infers category by matching keywords in title, description, and theme against a hardcoded keyword map. Categories can be manually edited in the JSON files afterward.


## Key File Locations

| What to change | Where |
|---|---|
| Category colors/icons | `src/types.ts` → `CAT_COLORS`, `CAT_ICONS` |
| Agent Q&A intent patterns | `src/components/AgentChat.tsx` → `findAnswer()` |
| Category auto-inference | `scripts/archive-ideas.py` → `infer_category()` |
| Astryx design tokens | `src/styles/global.css` (CSS variable overrides) |
| Deployment base URL | `vite.config.ts` → `base: '/ideas-archive/'` |

## Environment Variables

None required for development. For running `scripts/archive-ideas.py` manually:
- `GITHUB_TOKEN`: GitHub PAT for pushing updates
- `SLACK_TOKEN`: Slack bot token for reading channel messages
- `IDEAS_REPO`: Path to local clone (defaults to `~/projects/ideas-archive`)
