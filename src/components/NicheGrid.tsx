import type { Idea } from '../types'
import { NicheCard } from './NicheCard'

interface NicheGridProps {
  niches: Idea[]
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpenDetail: (idea: Idea) => void
  isFiltered: boolean
  loading: boolean
}

export function NicheGrid({ niches, toggleStar, formatDate, onOpenDetail, isFiltered, loading }: NicheGridProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <span>Chargement des niches…</span>
      </div>
    )
  }

  if (niches.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📊</span>
        <h3>{isFiltered ? 'Aucune niche trouvée' : 'Aucune niche pour le moment'}</h3>
        <p>{isFiltered
          ? 'Essaie de modifier ou réinitialiser les filtres.'
          : 'Les niches apparaîtront ici après chaque scan hebdomadaire.'}
        </p>
      </div>
    )
  }

  return (
    <div className="niche-grid">
      {niches.map((niche, i) => (
        <NicheCard
          key={niche.id}
          idea={niche}
          index={i}
          toggleStar={toggleStar}
          formatDate={formatDate}
          onOpen={onOpenDetail}
        />
      ))}
    </div>
  )
}
