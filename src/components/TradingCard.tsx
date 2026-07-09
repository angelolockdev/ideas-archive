import { useRef, useCallback } from 'react'
import { Star } from 'lucide-react'
import type { Idea } from '../types'
import { CAT_COLORS, CAT_ICONS, DIFFICULTY_LABELS } from '../types'

interface TradingCardProps {
  idea: Idea
  index: number
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpen: (idea: Idea) => void
}

const diffStep = (d: number | null) => d ? Math.max(1, Math.min(5, d)) : 3
const diffLabel = (d: number | null) => DIFFICULTY_LABELS[diffStep(d)]
const diffPct = (d: number | null) => `${(diffStep(d) / 5) * 100}%`

export function TradingCard({ idea, index, toggleStar, formatDate, onOpen }: TradingCardProps) {
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

  return (
    <div
      ref={cardRef}
      className="trading-card rise"
      style={{ animationDelay: `${(index % 8) * 30}ms` }}
      onMouseMove={handleMouseMove}
    >
      <div className="trading-card-inner" onClick={() => onOpen(idea)}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          {/* Market size badge */}
          {idea.market_size && (
            <div
              style={{
                flexShrink: 0,
                background: 'rgba(139,92,246,.12)',
                border: '1px solid rgba(139,92,246,.28)',
                borderRadius: 'var(--radius-inner)',
                padding: '5px 9px',
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8b5cf6', letterSpacing: '0.04em' }}>
                VOLUME
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: '#8b5cf6', lineHeight: 1.2, marginTop: 1 }}>
                {idea.market_size}
              </div>
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ fontSize: 11, lineHeight: 1.5, flexShrink: 0 }}>{CAT_ICONS['trading-strategy']}</span>
              <h3 className="trading-card-title">{idea.title}</h3>
            </div>
            <p className="trading-card-desc">{idea.description}</p>
          </div>

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
        <div className="trading-metrics">
          <div className="trading-metric">
            <span className="trading-metric-label">Difficulté</span>
            <div className="trading-gauge">
              <div className="trading-gauge-track">
                <div className="trading-gauge-fill" style={{ width: diffPct(idea.difficulty) }} />
              </div>
              <span className="trading-metric-value">{diffLabel(idea.difficulty)}</span>
            </div>
          </div>

          {idea.revenue && (
            <div className="trading-metric">
              <span className="trading-metric-label">Objectif</span>
              <span className="trading-metric-value trading-revenue">{idea.revenue}</span>
            </div>
          )}
        </div>

        {/* Stack */}
        {idea.stack && (
          <div className="trading-stack">
            <span className="trading-metric-label">Stack</span>
            <p>{idea.stack}</p>
          </div>
        )}

        {/* Why now */}
        {idea.why_now && (
          <div className="trading-why-now">
            <span className="trading-metric-label">Pourquoi maintenant</span>
            <p>{idea.why_now}</p>
          </div>
        )}

        {/* Footer */}
        <div className="trading-footer">
          <span className="trading-date">{formatDate(idea.date)}</span>
          <span className="trading-source">Analyse Trading</span>
        </div>
      </div>
    </div>
  )
}
