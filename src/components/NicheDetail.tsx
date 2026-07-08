import { useEffect, useCallback } from 'react'
import { X, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import type { Idea } from '../types'
import { DIFFICULTY_LABELS, COMPETITION_LABELS, COMPETITION_COLORS, CAT_ICONS } from '../types'

interface NicheDetailProps {
  niche: Idea
  prevNiche: Idea | null
  nextNiche: Idea | null
  onClose: () => void
  onNavigate: (idea: Idea) => void
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
}

export function NicheDetail({ niche, prevNiche, nextNiche, onClose, onNavigate, toggleStar, formatDate }: NicheDetailProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && prevNiche) onNavigate(prevNiche)
    if (e.key === 'ArrowRight' && nextNiche) onNavigate(nextNiche)
  }, [onClose, prevNiche, nextNiche, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const diffLabel = DIFFICULTY_LABELS[niche.difficulty ?? 3] || 'Non spécifiée'
  const compLabel = niche.competition ? (COMPETITION_LABELS[niche.competition] || niche.competition) : null
  const compColor = niche.competition ? (COMPETITION_COLORS[niche.competition] || '#9ca3af') : null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={niche.title}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{CAT_ICONS['business-niche']}</span>
            <span className="eyebrow">Niche Business</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => toggleStar(niche.id)}
              aria-label={niche.status === 'starred' ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="modal-icon-btn"
            >
              <Star size={15} fill={niche.status === 'starred' ? 'var(--ochre)' : 'none'} />
            </button>
            <button onClick={onClose} aria-label="Fermer" className="modal-icon-btn">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="detail-scroll">
          {/* Title + market */}
          <div style={{ marginBottom: 20 }}>
            <h2 className="detail-title">{niche.title}</h2>
            {niche.market_size && (
              <div className="niche-market-badge">
                Marché : {niche.market_size}
              </div>
            )}
          </div>

          {/* Description */}
          <section className="detail-section">
            <h4 className="detail-section-title">Description</h4>
            <p className="detail-text">{niche.description}</p>
          </section>

          {/* Problem */}
          <section className="detail-section">
            <h4 className="detail-section-title">Problème identifié</h4>
            <p className="detail-text">{niche.problem}</p>
          </section>

          {/* Market */}
          {niche.market && (
            <section className="detail-section">
              <h4 className="detail-section-title">Marché cible</h4>
              <p className="detail-text">{niche.market}</p>
            </section>
          )}

          {/* Why now */}
          {niche.why_now && (
            <section className="detail-section">
              <h4 className="detail-section-title">Pourquoi maintenant</h4>
              <p className="detail-text">{niche.why_now}</p>
            </section>
          )}

          {/* Metrics grid */}
          <div className="niche-detail-metrics">
            {/* Difficulty */}
            <div className="niche-detail-metric">
              <span className="detail-section-title">Difficulté</span>
              <div className="niche-detail-gauge">
                <div className="niche-gauge-track" style={{ height: 8 }}>
                  <div
                    className="niche-gauge-fill"
                    style={{ width: `${((niche.difficulty ?? 3) / 5) * 100}%` }}
                  />
                </div>
                <span className="niche-metric-value">{diffLabel}</span>
              </div>
            </div>

            {compLabel && (
              <div className="niche-detail-metric">
                <span className="detail-section-title">Concurrence</span>
                <span className="niche-metric-value" style={{ color: compColor || undefined, fontSize: 14 }}>{compLabel}</span>
              </div>
            )}
          </div>

          {/* Revenue */}
          {niche.revenue && (
            <section className="detail-section">
              <h4 className="detail-section-title">Revenus potentiels</h4>
              <p className="detail-text">{niche.revenue}</p>
            </section>
          )}

          {/* Action plan */}
          {niche.action_plan && (
            <section className="detail-section">
              <h4 className="detail-section-title">Plan d'action</h4>
              <p className="detail-text">{niche.action_plan}</p>
            </section>
          )}

          {/* Stack */}
          {niche.stack && (
            <section className="detail-section">
              <h4 className="detail-section-title">Stack technique</h4>
              <p className="detail-text">{niche.stack}</p>
            </section>
          )}

          {/* Footer */}
          <div className="detail-footer">
            <span>{formatDate(niche.date)}</span>
            <span className="eyebrow">Scan Hebdomadaire · {niche.id}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="detail-nav" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => prevNiche && onNavigate(prevNiche)}
            disabled={!prevNiche}
            className="detail-nav-btn"
          >
            <ArrowLeft size={14} />
            <span>{prevNiche?.title || '—'}</span>
          </button>
          <button
            onClick={() => nextNiche && onNavigate(nextNiche)}
            disabled={!nextNiche}
            className="detail-nav-btn"
            style={{ textAlign: 'right' }}
          >
            <span>{nextNiche?.title || '—'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
