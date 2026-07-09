import { useEffect, useCallback } from 'react'
import { X, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import type { Idea } from '../types'
import { DIFFICULTY_LABELS, CAT_ICONS } from '../types'

interface TradingDetailProps {
  strategy: Idea
  prevStrategy: Idea | null
  nextStrategy: Idea | null
  onClose: () => void
  onNavigate: (idea: Idea) => void
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
}

export function TradingDetail({ strategy, prevStrategy, nextStrategy, onClose, onNavigate, toggleStar, formatDate }: TradingDetailProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && prevStrategy) onNavigate(prevStrategy)
    if (e.key === 'ArrowRight' && nextStrategy) onNavigate(nextStrategy)
  }, [onClose, prevStrategy, nextStrategy, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const diffLabel = DIFFICULTY_LABELS[strategy.difficulty ?? 3] || 'Non spécifiée'

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={strategy.title}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{CAT_ICONS['trading-strategy']}</span>
            <span className="eyebrow">Stratégie Trading</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => toggleStar(strategy.id)}
              aria-label={strategy.status === 'starred' ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="modal-icon-btn"
            >
              <Star size={15} fill={strategy.status === 'starred' ? 'var(--ochre)' : 'none'} />
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
            <h2 className="detail-title">{strategy.title}</h2>
            {strategy.market_size && (
              <div className="trading-market-badge">
                Volume : {strategy.market_size}
              </div>
            )}
          </div>

          {/* Description */}
          <section className="detail-section">
            <h4 className="detail-section-title">Description</h4>
            <p className="detail-text">{strategy.description}</p>
          </section>

          {/* Problem */}
          <section className="detail-section">
            <h4 className="detail-section-title">Problème identifié</h4>
            <p className="detail-text">{strategy.problem}</p>
          </section>

          {/* Market */}
          {strategy.market && (
            <section className="detail-section">
              <h4 className="detail-section-title">Marché cible</h4>
              <p className="detail-text">{strategy.market}</p>
            </section>
          )}

          {/* Why now */}
          {strategy.why_now && (
            <section className="detail-section">
              <h4 className="detail-section-title">Pourquoi maintenant</h4>
              <p className="detail-text">{strategy.why_now}</p>
            </section>
          )}

          {/* Metrics grid */}
          <div className="trading-detail-metrics">
            <div className="trading-detail-metric">
              <span className="detail-section-title">Difficulté</span>
              <div className="trading-detail-gauge">
                <div className="niche-gauge-track" style={{ height: 8 }}>
                  <div className="niche-gauge-fill" style={{ width: `${((strategy.difficulty ?? 3) / 5) * 100}%` }} />
                </div>
                <span className="niche-metric-value">{diffLabel}</span>
              </div>
            </div>

            {strategy.revenue && (
              <div className="trading-detail-metric">
                <span className="detail-section-title">Objectif de rendement</span>
                <span className="niche-metric-value" style={{ color: '#8b5cf6', fontSize: 14 }}>{strategy.revenue}</span>
              </div>
            )}
          </div>

          {/* Action plan */}
          {strategy.action_plan && (
            <section className="detail-section">
              <h4 className="detail-section-title">Plan d'action</h4>
              <p className="detail-text">{strategy.action_plan}</p>
            </section>
          )}

          {/* Stack */}
          {strategy.stack && (
            <section className="detail-section">
              <h4 className="detail-section-title">Stack technique</h4>
              <p className="detail-text">{strategy.stack}</p>
            </section>
          )}

          {/* Theme */}
          {strategy.theme && (
            <section className="detail-section">
              <h4 className="detail-section-title">Approche</h4>
              <p className="detail-text">{strategy.theme}</p>
            </section>
          )}

          {/* Footer */}
          <div className="detail-footer">
            <span>{formatDate(strategy.date)}</span>
            <span className="eyebrow">Analyse Trading · {strategy.id}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="detail-nav" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => prevStrategy && onNavigate(prevStrategy)}
            disabled={!prevStrategy}
            className="detail-nav-btn"
          >
            <ArrowLeft size={14} />
            <span>{prevStrategy?.title || '—'}</span>
          </button>
          <button
            onClick={() => nextStrategy && onNavigate(nextStrategy)}
            disabled={!nextStrategy}
            className="detail-nav-btn"
            style={{ textAlign: 'right' }}
          >
            <span>{nextStrategy?.title || '—'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
