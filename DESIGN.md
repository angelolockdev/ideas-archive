---
version: 2.0
name: Ideas-Archive
description: |
  Archive des meilleures idées applicatives avec un rendu moderne propulsé par Astryx (Meta).
  Design system React + StyleX, composants accessibles, thème Neutral, dark/light mode natif.
  Agent IA intégré pour assister les visiteurs dans l'exploration des idées.
framework: Vite + React 19 + TypeScript
design_system: Astryx by Meta (facebook/astryx)
theme: Neutral (@astryxdesign/theme-neutral)

colors:
  # Astryx Neutral Theme Tokens
  accent: "#60a5fa"           # Blue accent
  accent-hover: "#3b82f6"
  green: "#34d399"
  orange: "#f59e0b"
  purple: "#a78bfa"
  teal: "#2dd4bf"
  red: "#ef4444"

typography:
  family: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  mono: "JetBrains Mono, ui-monospace, monospace"
  # Géré par les tokens de typographie Astryx

components:
  # Composants Astryx utilisés
  - Theme: Provider de thème (neutralTheme)
  - Button: Boutons primary/secondary/ghost
  - Card: Cartes avec variants
  - Badge: Badges de catégorie/région
  - TextInput: Champ de recherche
  - Selector: Filtres par mois/catégorie/région/source
  - Spinner: Indicateur de chargement
  - Heading: Titres
  - Text: Corps de texte

  # Composants personnalisés (utilisant les tokens Astryx)
  - NavBar: Navigation sticky avec glass effect
  - HeroSection: Section d'accueil avec gradient
  - StatsBar: Barre de statistiques (total, coups de cœur, régions)
  - FilterBar: Barre de filtres complète
  - IdeaGrid: Grille responsive des idées
  - IdeaCard: Carte d'idée avec expand/collapse
  - AgentChat: Chatbot assistant IA flottant
  - Footer: Pied de page

architecture:
  build: Vite 5 (build statique)
  deploy: GitHub Pages via GitHub Actions
  data: Fichiers JSON mensuels dans public/data/
  cron: Deux jobs Hermes (archive + génération)

agent:
  type: Client-side Q&A intelligent
  capabilities:
    - Recherche sémantique dans les idées
    - Statistiques en temps réel
    - Filtrage par catégorie/région
    - Suggestions contextuelles
    - Interface chat style messagerie
  position: Widget flottant en bas à droite
  theme: Astryx surface + tokens
---

## Architecture

```
ideas-archive/
├── .github/workflows/deploy.yml  # GitHub Pages deployment
├── public/data/                  # Fichiers JSON mensuels (servis statiquement)
│   ├── 2026-06.json
│   └── 2026-07.json
├── src/
│   ├── main.tsx                  # Point d'entrée React
│   ├── App.tsx                   # Application principale avec Theme Astryx
│   ├── types.ts                  # Types TypeScript (Idea, Category, etc.)
│   ├── styles/global.css         # Imports CSS Astryx + overrides
│   └── components/
│       ├── NavBar.tsx            # Navigation (Astryx Button)
│       ├── HeroSection.tsx       # Section héro
│       ├── StatsBar.tsx          # Statistiques
│       ├── FilterBar.tsx         # Filtres (Astryx Selector, TextInput, Button)
│       ├── IdeaGrid.tsx          # Grille d'idées (Astryx Spinner)
│       ├── IdeaCard.tsx          # Carte d'idée (Astryx Card, Badge)
│       ├── AgentChat.tsx         # Assistant IA
│       └── Footer.tsx            # Pied de page
├── scripts/archive-ideas.py      # Script d'archivage
├── DESIGN.md                     # Ce fichier
├── index.html                    # Entry Vite
├── vite.config.ts                # Configuration Vite
├── tsconfig.json                 # Configuration TypeScript
└── package.json                  # Dépendances (Astryx, React 19)
```
