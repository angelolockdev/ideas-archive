import { useRef, useCallback } from 'react'
import { Star } from 'lucide-react'
import type { Idea } from '../types'
import { CATEGORIES, CAT_COLORS, CAT_ICONS, DIFFICULTY_LABELS, COMPETITION_LABELS, COMPETITION_COLORS } from '../types'

interface NicheCardProps {
  idea: Idea
  index: number
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpen: (idea: Idea) => void
}

const diffStep = (d: number | null) => d ? Math.max(1, Math.min(5, d)) : 3
const diffLabel = (d: number | null) => DIFFICULTY_LABELS[diffStep(d)]
const diffPct = (d: number | null) => `${(diffStep(d) / 5) * 100}%`

export function NicheCard({ idea, index, toggleStar, formatDate, onOpen }: NicheCardProps) {
  const starred = idea.status === 'starred'
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
  }, [])

  const compLabel = idea.competition ? (COMPETITION_LABELS[idea.competition] || idea.competition) : null
  const compColor = idea.competition ? (COMPETITION_COLORS[idea.competition] || '#9ca3af') : null

  return (
    <div
      ref={cardRef}
      className="niche-card rise"
      style={{ animationDelay: `${(index % 8) * 30}ms` }}
      onMouseMove={handleMouseMove}
    >
      <div className="niche-card-inner" onClick={() => onOpen(idea)}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          {/* Market size badge */}
          {idea.market_size && (
            <div
              style={{
                flexShrink: 0,
                background: 'var(--ochre-tint)',
                border: '1px solid var(--ochre-line)',
                borderRadius: 'var(--radius-inner)',
                padding: '5px 9px',
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ochre)', letterSpacing: '0.04em' }}>
                MARCHÉ
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ochre)', lineHeight: 1.2, marginTop: 1 }}>
                {idea.market_size}
              </div>
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ fontSize: 11, lineHeight: 1.5, flexShrink: 0 }}>{CAT_ICONS['business-niche']}</span>
              <h3 className="niche-card-title">{idea.title}</h3>
            </div>

            {/* Description */}
            <p className="niche-card-desc">{idea.description}</p>
          </div>

          {/* Star button */}
          <button
            onClick={e => { e.stopPropagation(); toggleStar(idea.id) }}
            aria-label={starred ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur'}
            className={`star-btn ${starred ? 'starred' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <Star size={14} fill={starred ? 'var(--ochre)' : 'none'} />
          </button>
        </div>

        {/* Metrics row */}
        <div className="niche-metrics">
          {/* Difficulty gauge */}
          <div className="niche-metric">
            <span className="niche-metric-label">Difficulté</span>
            <div className="niche-gauge">
              <div className="niche-gauge-track">
                <div
                  className="niche-gauge-fill"
                  style={{ width: diffPct(idea.difficulty) }}
                />
              </div>
              <span className="niche-metric-value">{diffLabel(idea.difficulty)}</span>
            </div>
          </div>

          {/* Competition */}
          {compLabel && (
            <div className="niche-metric">
              <span className="niche-metric-label">Concurrence</span>
              <span className="niche-metric-value" style={{ color: compColor || undefined }}>
                {compLabel}
              </span>
            </div>
          )}

          {/* Revenue */}
          {idea.revenue && (
            <div className="niche-metric">
              <span className="niche-metric-label">Revenus</span>
              <span className="niche-metric-value niche-revenue">{idea.revenue}</span>
            </div>
          )}
        </div>

        {/* Action plan snippet */}
        {idea.action_plan && (
          <div className="niche-action-plan">
            <span className="niche-metric-label">Plan d'action</span>
            <p>{idea.action_plan}</p>
          </div>
        )}

        {/* Why now */}
        {idea.why_now && (
          <div className="niche-why-now">
            <span className="niche-metric-label">Pourquoi maintenant</span>
            <p>{idea.why_now}</p>
          </div>
        )}

        {/* Footer: date + source */}
        <div className="niche-footer">
          <span className="niche-date">{formatDate(idea.date)}</span>
          <span className="niche-source">Scan Hebdomadaire</span>
        </div>
      </div>
    </div>
  )
}
