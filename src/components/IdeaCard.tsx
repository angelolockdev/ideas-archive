import { useState } from 'react'
import type { Idea } from '../types'
import { CATEGORIES, CAT_COLORS, CAT_ICONS } from '../types'

const DIFF_LABELS: Record<number, string> = {
  1: 'Très facile',
  2: 'Facile',
  3: 'Moyen',
  4: 'Difficile',
  5: 'Très difficile',
}

interface IdeaCardProps {
  idea: Idea
  index: number
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
}

export function IdeaCard({ idea, index, toggleStar, formatDate }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false)
  const starred = idea.status === 'starred'
  const catColor = CAT_COLORS[idea.category] || '#9ca3af'
  const catIcon = CAT_ICONS[idea.category] || '💡'
  const regionLabel = idea.region === 'madagascar' ? '🇲🇬 Mada' : '🌍 Global'

  return (
    <div
      style={{
        background: 'var(--color-background-surface)',
        border: `1px solid ${starred ? '#f59e0b' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-container)',
        padding: 18,
        position: 'relative',
        cursor: 'default',
        animation: `fadeIn 0.3s ease both`,
        animationDelay: `${(index % 5) * 40}ms`,
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
      className="idea-card"
    >
      {/* Star button */}
      <button
        onClick={() => toggleStar(idea.id)}
        title={starred ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur'}
        style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30,
          borderRadius: 6,
          background: starred ? 'rgba(245,158,11,.12)' : 'transparent',
          border: `1px solid ${starred ? '#f59e0b' : 'var(--color-border)'}`,
          color: starred ? '#f59e0b' : 'var(--color-text-tertiary)',
          fontSize: 14, cursor: 'pointer',
        }}
      >
        {starred ? '★' : '☆'}
      </button>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{
          padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
          background: `${catColor}18`, color: catColor,
        }}>
          {catIcon} {CATEGORIES[idea.category]}
        </span>
        <span style={{
          padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
          background: idea.region === 'madagascar' ? 'rgba(52,211,153,.12)' : 'rgba(96,165,250,.12)',
          color: idea.region === 'madagascar' ? '#34d399' : '#60a5fa',
          border: idea.region === 'madagascar' ? '1px solid rgba(52,211,153,.2)' : '1px solid rgba(96,165,250,.2)',
        }}>
          {regionLabel}
        </span>
        {idea.source === 'self-improving' && (
          <span style={{
            padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
            background: 'rgba(167,139,250,.12)', color: '#a78bfa',
            border: '1px solid rgba(167,139,250,.2)',
          }}>
            Self-Improving
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, lineHeight: 1.3, color: 'var(--color-text-primary)' }}>
        {idea.title}
      </div>

      {/* Date + difficulty */}
      <div style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
        {formatDate(idea.date)}
        {idea.theme && <> · {idea.theme}</>}
        {idea.difficulty && (
          <>
            {' · '}
            <span className="diff-dots">
              {Array.from({ length: 5 }, (_, j) => (
                <span key={j} className={j < idea.difficulty! ? 'filled' : 'empty'} />
              ))}
            </span>
            {' '}{DIFF_LABELS[idea.difficulty] || ''}
          </>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)',
        margin: '0 0 10px',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {idea.description || idea.problem || ''}
      </p>

      {/* Meta tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {idea.market && (
          <span style={metaStyle}>{idea.market.slice(0, 40)}{idea.market.length > 40 ? '...' : ''}</span>
        )}
        {idea.revenue && (
          <span style={metaStyle}>{idea.revenue.slice(0, 35)}{idea.revenue.length > 35 ? '...' : ''}</span>
        )}
        {idea.stack && (
          <span style={metaStyle}>{idea.stack.slice(0, 30)}{idea.stack.length > 30 ? '...' : ''}</span>
        )}
      </div>

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none', border: 'none',
          color: 'var(--color-accent)', fontSize: 11.5,
          cursor: 'pointer', padding: 0, fontWeight: 500,
        }}
      >
        {expanded ? 'Voir moins ↑' : 'Voir plus ↓'}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          marginTop: 10, paddingTop: 12,
          borderTop: '1px solid var(--color-border)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {idea.description && <DetailBlock label="Description" value={idea.description} />}
          {idea.problem && <DetailBlock label="Problème" value={idea.problem} />}
          {idea.market && <DetailBlock label="Marché" value={idea.market} />}
          {idea.revenue && <DetailBlock label="Revenus" value={idea.revenue} />}
          {idea.stack && <DetailBlock label="Stack" value={idea.stack} />}
          {idea.why_now && <DetailBlock label="Pourquoi maintenant" value={idea.why_now} />}
          {idea.mvp_plan && <DetailBlock label="MVP" value={idea.mvp_plan} />}
        </div>
      )}
    </div>
  )
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.5px', color: 'var(--color-text-tertiary)',
        marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
        {value}
      </div>
    </div>
  )
}

const metaStyle: React.CSSProperties = {
  fontSize: 11, padding: '2px 7px', borderRadius: 4,
  background: 'var(--color-background-body)',
  color: 'var(--color-text-tertiary)',
  border: '1px solid var(--color-border)',
}
