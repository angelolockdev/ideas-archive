import type { Idea } from '../types'
import { TradingCard } from './TradingCard'

interface TradingGridProps {
  strategies: Idea[]
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpenDetail: (idea: Idea) => void
  isFiltered: boolean
  loading: boolean
}

export function TradingGrid({ strategies, toggleStar, formatDate, onOpenDetail, isFiltered, loading }: TradingGridProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <span>Chargement des stratégies…</span>
      </div>
    )
  }

  if (strategies.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📈</span>
        <h3>{isFiltered ? 'Aucune stratégie trouvée' : 'Aucune stratégie pour le moment'}</h3>
        <p>{isFiltered
          ? 'Essaie de modifier ou réinitialiser les filtres.'
          : 'Les stratégies de trading apparaîtront ici après chaque analyse.'}
        </p>
      </div>
    )
  }

  return (
    <div className="trading-grid">
      {strategies.map((strat, i) => (
        <TradingCard
          key={strat.id}
          idea={strat}
          index={i}
          toggleStar={toggleStar}
          formatDate={formatDate}
          onOpen={onOpenDetail}
        />
      ))}
    </div>
  )
}
