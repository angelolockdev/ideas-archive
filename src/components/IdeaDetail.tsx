import { useEffect, useCallback } from 'react'
import type { Idea } from '../types'
import { CATEGORIES, CAT_COLORS, CAT_ICONS, DIFFICULTY_LABELS } from '../types'

interface IdeaDetailProps {
  idea: Idea
  prevIdea: Idea | null
  nextIdea: Idea | null
  onClose: () => void
  onNavigate: (idea: Idea) => void
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
}

export function IdeaDetail({
  idea, prevIdea, nextIdea, onClose, onNavigate, toggleStar, formatDate,
}: IdeaDetailProps) {
  const starred = idea.status === 'starred'
  const catColor = CAT_COLORS[idea.category] || '#9ca3af'

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && prevIdea) onNavigate(prevIdea)
      if (e.key === 'ArrowRight' && nextIdea) onNavigate(nextIdea)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate, prevIdea, nextIdea])

  const handleScrimClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  return (
    <div
      className="detail-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={`Détail : ${idea.title}`}
      onClick={handleScrimClick}
    >
      <div className="detail-sheet">
        {/* Sticky top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-background-surface)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          {/* Prev/Next */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => prevIdea && onNavigate(prevIdea)}
              disabled={!prevIdea}
              aria-label="Spécimen précédent"
              title="Précédent (←)"
              style={navBtnStyle(!prevIdea)}
            >←</button>
            <button
              onClick={() => nextIdea && onNavigate(nextIdea)}
              disabled={!nextIdea}
              aria-label="Spécimen suivant"
              title="Suivant (→)"
              style={navBtnStyle(!nextIdea)}
            >→</button>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Star */}
            <button
              onClick={() => toggleStar(idea.id)}
              aria-pressed={starred}
              aria-label={starred ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur'}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-element)',
                border: `1px solid ${starred ? 'var(--ochre-line)' : 'var(--color-border)'}`,
                background: starred ? 'var(--ochre-tint)' : 'transparent',
                color: starred ? 'var(--ochre)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: 12,
                cursor: 'pointer',
                display: 'flex', gap: 5, alignItems: 'center',
                transition: 'all 0.18s ease',
              }}
            >
              {starred ? '◆' : '◇'}&nbsp;{starred ? 'Coup de cœur' : 'Marquer'}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Fermer le détail"
              title="Fermer (Échap)"
              style={{
                width: 32, height: 32,
                borderRadius: 'var(--radius-element)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer', fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Catalog + date row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11.5,
              color: 'var(--ochre)',
              background: 'var(--ochre-tint)',
              border: '1px solid var(--ochre-line)',
              padding: '3px 9px', borderRadius: 'var(--radius-inner)',
              letterSpacing: '0.05em',
            }}>№ {idea.id}</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--color-text-tertiary)',
            }}>{formatDate(idea.date)}</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 5, fontSize: 12, fontWeight: 600,
              background: `${catColor}1a`, color: catColor, border: `1px solid ${catColor}36`,
            }}>
              {CAT_ICONS[idea.category]} {CATEGORIES[idea.category]}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 5, fontSize: 12, fontWeight: 600,
              background: idea.region === 'madagascar' ? 'rgba(52,211,153,.10)' : 'rgba(96,165,250,.10)',
              color: idea.region === 'madagascar' ? '#34d399' : '#60a5fa',
              border: idea.region === 'madagascar' ? '1px solid rgba(52,211,153,.22)' : '1px solid rgba(96,165,250,.22)',
            }}>
              {idea.region === 'madagascar' ? '🇲🇬 Madagascar' : '🌍 Global'}
            </span>
            {idea.difficulty != null && (
              <span style={{
                padding: '3px 10px', borderRadius: 5, fontSize: 12,
                fontFamily: 'var(--font-mono)',
                background: 'var(--ochre-tint)', color: 'var(--ochre)',
                border: '1px solid var(--ochre-line)',
              }}>
                {DIFFICULTY_LABELS[idea.difficulty]}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32, fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 8px',
            color: 'var(--color-text-primary)',
          }}>
            {idea.title}
          </h2>

          {/* Keyword / theme eyebrow */}
          {(idea.keyword || idea.theme) && (
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              {idea.theme && <span>{idea.theme}</span>}
              {idea.keyword && <span style={{ color: 'var(--ochre)' }}>{idea.keyword}</span>}
            </div>
          )}

          {/* Field sections */}
          <div style={{ marginTop: 24 }}>
            {idea.description && (
              <FieldSection label="Solution" value={idea.description} accent />
            )}
            {idea.problem && <FieldSection label="Problème" value={idea.problem} />}
            {idea.market   && <FieldSection label="Marché"   value={idea.market} />}
            {idea.revenue  && <FieldSection label="Revenus"  value={idea.revenue} />}
            {idea.why_now  && <FieldSection label="Pourquoi maintenant" value={idea.why_now} />}
            {idea.mvp_plan && <FieldSection label="Plan MVP" value={idea.mvp_plan} />}
            {idea.stack && (
              <div className="detail-field">
                <div className="eyebrow" style={{ marginBottom: 8 }}>Stack technique</div>
                <code style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {idea.stack}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Bottom keyboard hint */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          padding: '12px 24px 18px',
          borderTop: '1px solid var(--color-border)',
          gap: 16,
        }}>
          {[
            ['← →', 'naviguer'],
            ['Échap', 'fermer'],
          ].map(([key, label]) => (
            <span key={key} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--color-text-tertiary)',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              <kbd style={{
                padding: '2px 6px',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                background: 'var(--color-background-body)',
                fontSize: 10,
              }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FieldSection({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="detail-field">
      <div className="eyebrow" style={{ marginBottom: 8, color: accent ? 'var(--ochre)' : undefined }}>
        {label}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14, lineHeight: 1.65,
        color: accent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  )
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 32, height: 32,
    borderRadius: 'var(--radius-element)',
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: disabled ? 0.35 : 1,
    transition: 'opacity 0.15s',
  }
}
