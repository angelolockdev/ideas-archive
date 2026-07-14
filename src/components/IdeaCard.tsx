import { Star, FolderPlus, ChevronRight } from 'lucide-react'
import type { Idea, Collection } from '../types'
import { CATEGORIES, CAT_COLORS, CAT_ICONS, DIFFICULTY_LABELS } from '../types'
import { useDirectionalGlow } from '../hooks/useDirectionalGlow'

interface IdeaCardProps {
  idea: Idea
  index: number
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpen: (idea: Idea) => void
  collections: Collection[]
  onAddToCollection: (ideaId: string, colId: string) => void
  viewMode: 'grid' | 'list'
}

export function IdeaCard({
  idea, index, toggleStar, formatDate, onOpen,
  collections, onAddToCollection, viewMode,
}: IdeaCardProps) {
  const starred = idea.status === 'starred'
  const catColor = CAT_COLORS[idea.category] || '#9ca3af'
  const { cardRef, handleMouseMove } = useDirectionalGlow()

  if (viewMode === 'list') {
    return (
      <button
        className="idea-row rise"
        style={{ animationDelay: `${(index % 8) * 30}ms` }}
        onClick={() => onOpen(idea)}
        aria-label={`Ouvrir les détails de "${idea.title}"`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--ochre)', letterSpacing: '0.06em',
            }}>
              {idea.id.substring(0, 8)}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}>{idea.title}</span>
            {starred && <Star size={11} fill="currentColor" style={{ color: 'var(--ochre)', flexShrink: 0 }} />}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--color-text-tertiary)',
            }}>
              {formatDate(idea.date)}
            </span>
            <CategoryBadge idea={idea} catColor={catColor} />
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
      </button>
    )
  }

  return (
    <div
      ref={cardRef}
      className={`idea-card rise${starred ? ' is-starred' : ''}`}
      style={{ animationDelay: `${(index % 8) * 35}ms` }}
      onMouseMove={handleMouseMove}
    >
      {/* Clickable overlay for "open detail" */}
      <button
        className="idea-card__open"
        onClick={() => onOpen(idea)}
        aria-label={`Ouvrir les détails de "${idea.title}"`}
      />

      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '14px 14px 0',
      }}>
        {/* Catalog number */}
        <span className="catalog-no">{idea.id.substring(0, 8)}</span>

        {/* Action buttons — must be above the .idea-card__open overlay (z-index: auto) */}
        <div style={{ display: 'flex', gap: 4, position: 'relative', zIndex: 1 }}>
          {/* Add to collection */}
          {collections.length > 0 && (
            <div style={{ position: 'relative' }}>
              <select
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  if (e.target.value) onAddToCollection(idea.id, e.target.value)
                  e.target.value = ''
                }}
                defaultValue=""
                aria-label={`Ajouter "${idea.title}" à une collection`}
                style={{
                  appearance: 'none', WebkitAppearance: 'none',
                  width: 28, height: 28,
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'transparent',
                  cursor: 'pointer',
                  position: 'absolute', inset: 0, opacity: 0,
                }}
              >
                <option value="">+ Collection</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div style={{
                pointerEvents: 'none',
                width: 28, height: 28,
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-tertiary)',
              }}><FolderPlus size={13} /></div>
            </div>
          )}

          {/* Star */}
          <button
            onClick={e => { e.stopPropagation(); toggleStar(idea.id) }}
            aria-label={starred ? `Retirer "${idea.title}" des coups de cœur` : `Ajouter "${idea.title}" aux coups de cœur`}
            aria-pressed={starred}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: `1px solid ${starred ? 'var(--ochre-line)' : 'var(--color-border)'}`,
              background: starred ? 'var(--ochre-tint)' : 'transparent',
              color: starred ? 'var(--ochre)' : 'var(--color-text-tertiary)',
              fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s ease',
            }}
          >
            <Star size={13} fill={starred ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px 14px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 9 }}>
          <CategoryBadge idea={idea} catColor={catColor} />
          <RegionBadge idea={idea} />
          {idea.source === 'self-improving' && (
            <span style={badgeStyle('rgba(167,139,250,.12)', '#a78bfa', 'rgba(167,139,250,.22)')}>
              Self-Improving
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          color: 'var(--color-text-primary)',
          marginBottom: 6,
        }}>
          {idea.title}
        </div>

        {/* Meta line */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--color-text-tertiary)', marginBottom: 8,
        }}>
          <span>{formatDate(idea.date)}</span>
          {idea.theme && <><span style={{ opacity: 0.4 }}>·</span><span>{idea.theme}</span></>}
          {idea.difficulty != null && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <DiffMeter difficulty={idea.difficulty} />
              <span style={{ fontSize: 10 }}>{DIFFICULTY_LABELS[idea.difficulty]}</span>
            </>
          )}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13, lineHeight: 1.55,
          color: 'var(--color-text-secondary)',
          margin: 0, marginBottom: 10,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {idea.description || idea.problem || ''}
        </p>

        {/* Stack tag */}
        {idea.stack && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-background-body)',
            border: '1px solid var(--color-border)',
            padding: '2px 7px',
            borderRadius: 'var(--radius-inner)',
            display: 'inline-block',
            maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {idea.stack.slice(0, 55)}{idea.stack.length > 55 ? '…' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

function CategoryBadge({ idea, catColor }: { idea: Idea; catColor: string }) {
  return (
    <span style={badgeStyle(`${catColor}1a`, catColor, `${catColor}36`)}>
      {CAT_ICONS[idea.category]} {CATEGORIES[idea.category]}
    </span>
  )
}

function RegionBadge({ idea }: { idea: Idea }) {
  const isMada = idea.region === 'madagascar'
  return (
    <span style={badgeStyle(
      isMada ? 'rgba(52,211,153,.10)' : 'rgba(96,165,250,.10)',
      isMada ? '#34d399' : '#60a5fa',
      isMada ? 'rgba(52,211,153,.22)' : 'rgba(96,165,250,.22)',
    )}>
      {isMada ? '🇲🇬 Mada' : '🌍 Global'}
    </span>
  )
}

function badgeStyle(bg: string, color: string, border: string): React.CSSProperties {
  return {
    padding: '2px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
    background: bg, color, border: `1px solid ${border}`,
    whiteSpace: 'nowrap',
  }
}

function DiffMeter({ difficulty }: { difficulty: number }) {
  return (
    <span className="diff-meter" aria-label={`Difficulté ${difficulty} sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < difficulty ? 'on' : ''} />
      ))}
    </span>
  )
}
