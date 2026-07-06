# Ideas Archive

Archive des meilleures idees applicatives du channel `#cron-idees-apps`.

## Structure

```
data/                ← Fichiers JSON mensuels (2026-07.json, etc.)
index.html           ← Page web de visualisation et filtrage
scripts/
  archive-ideas.py   ← Script de parsing et mise a jour
```

## Format des donnees

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

## Utilisation

### Page web
Ouvrez `index.html` dans un navigateur pour visualiser, filtrer et marquer les idees.

### Coup de coeur
Cliquez sur l'etoile en haut a droite d'une carte pour la marquer comme coup de coeur.
Les coups de coeur sont persistants dans le navigateur (localStorage).

### Mise a jour automatique
Un cron job Hermes s'execute chaque lundi a 10h00 pour :
1. Recuperer les messages de `#cron-idees-apps` de la semaine
2. Analyser et structurer les nouvelles idees
3. Mettre a jour le fichier JSON mensuel
4. Pusher sur GitHub

## Sources

Deux crons alimentent ce canal :

| Cron | Horaire | Description |
|------|---------|-------------|
| **Idees d'application du matin** | 9h00 | Idees generales (marche global) |
| **Idees Matinales Self-Improving** | 8h00 | Idees ciblees Madagascar |
