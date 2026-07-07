# Ideas Archive

Archive des meilleures idées applicatives du channel `#cron-idees-apps`.

**Design system : [Astryx](https://github.com/facebook/astryx) par Meta** — 150+ composants React accessibles, thème Neutral, mode sombre/clair natif.

## 🚀 Stack

| Technologie | Usage |
|-------------|-------|
| **Astryx** (Meta) | Design system — composants, thème, tokens CSS |
| **React 19** | UI framework |
| **Vite 5** | Build tool (sortie statique) |
| **TypeScript** | Typage strict |
| **GitHub Pages** | Hébergement statique |

## 📂 Structure

```
data/                ← Fichiers JSON mensuels (2026-07.json, etc.)
public/data/         ← Copie pour le build Vite
src/                 ← Code source React/TypeScript
  components/        ← Composants UI (Astryx + custom)
scripts/             ← Scripts Python d'archivage
```

## 📊 Format des données

Chaque fichier mensuel suit cette structure :

```json
{
  "month": "2026-07",
  "updated_at": "2026-07-06T16:30:00Z",
  "ideas": [
    {
      "id": "20260705-mentoria",
      "title": "MentorIA",
      "description": "...",
      "problem": "...",
      "market": "...",
      "revenue": "...",
      "stack": "...",
      "difficulty": 3,
      "source": "idees-matin | self-improving",
      "region": "global | madagascar",
      "date": "2026-07-05",
      "status": "pending | starred",
      "category": "productivity | ai | fintech | health | transport | climate | social | edtech | devtools | iot | other"
    }
  ]
}
```

## 🤖 Assistant IA

Un agent intelligent est intégré à la page (widget en bas à droite) :

- **Recherche sémantique** dans toutes les idées
- **Statistiques** en temps réel
- **Exploration** par catégorie, région
- **Suggestions** contextuelles
- Interface de chat native Astryx

## 🔄 Automatisation

Deux cron jobs Hermes alimentent l'archive :

| Cron | Horaire | Description |
|------|---------|-------------|
| **Ideas Archive — Weekly Update** | Lundi 10h00 | Parse les messages Slack, met à jour les JSON, push GitHub |
| **Idées Hebdo — Self-Improving** | Lundi 8h00 | Génère des idées ciblées Madagascar |

## 🛠️ Développement

```bash
# Installation
npm install

# Dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 📦 Déploiement

Push sur `main` → GitHub Actions build → GitHub Pages.

URL : `https://angelolockdev.github.io/ideas-archive/`
