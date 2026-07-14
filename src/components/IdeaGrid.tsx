import { useMemo } from 'react'
import type { Idea, Collection, ViewMode } from '../types'
import { IdeaCard } from './IdeaCard'

interface IdeaGridProps {
  groups: Record<string, Idea[]>
  groupKeys: string[]
  toggleStar: (id: string) => void
  formatMonth: (ym: string) => string
  formatDate: (d: string) => string
  loading: boolean
  viewMode: ViewMode
  isFiltered: boolean
  onOpenDetail: (idea: Idea) => void
  collections: Collection[]
  onAddToCollection: (ideaId: string, colId: string) => void
}

export function IdeaGrid({
  groups, groupKeys, toggleStar, formatMonth, formatDate,
  loading, viewMode, isFiltered, onOpenDetail, collections, onAddToCollection,
}: IdeaGridProps) {
  const totalVisible = useMemo(
    () => groupKeys.reduce((s, k) => s + (groups[k]?.length ?? 0), 0),
    [groups, groupKeys],
  )

  if (loading) return <SkeletonGrid viewMode={viewMode} />

  if (groupKeys.length === 0) {
    return <EmptyState isFiltered={isFiltered} />
  }

  return (
    <div>
      {/* Total visible */}
      {groupKeys.length > 1 && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--color-text-tertiary)',
          }}>
            {totalVisible} spécimen{totalVisible > 1 ? 's' : ''} — {groupKeys.length} période{groupKeys.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {groupKeys.map(month => {
        const monthIdeas = groups[month].slice().sort((a, b) => b.date.localeCompare(a.date))
        return (
          <section key={month} style={{ marginBottom: 36 }} aria-label={formatMonth(month)}>
            {/* Month header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 16, paddingBottom: 10,
              borderBottom: '1px solid var(--color-border)',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22, fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '-0.015em',
                margin: 0,
                color: 'var(--color-text-primary)',
              }}>
                {formatMonth(month)}
              </h2>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--ochre)',
                background: 'var(--ochre-tint)',
                border: '1px solid var(--ochre-line)',
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
              }}>
                {monthIdeas.length}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} aria-hidden="true" />
            </div>

            {viewMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 14,
              }}>
                {monthIdeas.map((idea, i) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={i}
                    toggleStar={toggleStar}
                    formatDate={formatDate}
                    onOpen={onOpenDetail}
                    collections={collections}
                    onAddToCollection={onAddToCollection}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {monthIdeas.map((idea, i) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={i}
                    toggleStar={toggleStar}
                    formatDate={formatDate}
                    onOpen={onOpenDetail}
                    collections={collections}
                    onAddToCollection={onAddToCollection}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function SkeletonGrid({ viewMode }: { viewMode: ViewMode }) {
  const items = Array.from({ length: viewMode === 'grid' ? 6 : 8 })

  return (
    <div aria-busy="true" aria-label="Chargement des idées">
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 14,
        }}>
          {items.map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--color-background-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-container)',
      padding: '14px',
      animation: 'fadeIn 0.6s ease both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Bone w={64} h={10} r={4} />
        <Bone w={28} h={28} r={6} />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <Bone w={80} h={18} r={5} />
        <Bone w={60} h={18} r={5} />
      </div>
      <Bone w="100%" h={20} r={4} style={{ marginBottom: 6 }} />
      <Bone w="80%" h={20} r={4} style={{ marginBottom: 10 }} />
      <Bone w="100%" h={13} r={4} style={{ marginBottom: 4 }} />
      <Bone w="90%" h={13} r={4} style={{ marginBottom: 12 }} />
      <Bone w={120} h={22} r={4} />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 18px',
      background: 'var(--color-background-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-element)',
      animation: 'fadeIn 0.6s ease both',
    }}>
      <Bone w={50} h={10} r={4} />
      <Bone w={180} h={16} r={4} />
      <Bone w={70} h={18} r={5} />
    </div>
  )
}

function Bone({ w, h, r, style }: { w: number | string; h: number; r: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'var(--color-background-body)',
      animation: 'pulse 1.4s ease-in-out infinite',
      ...style,
    }} />
  )
}

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '80px 20px', textAlign: 'center',
      animation: 'rise 0.3s ease both',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 42, lineHeight: 1,
        color: 'var(--ochre)',
        opacity: 0.4,
        marginBottom: 16,
      }}>
        ∅
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22, fontWeight: 400, fontStyle: 'italic',
        margin: '0 0 8px',
        color: 'var(--color-text-primary)',
      }}>
        {isFiltered ? 'Aucun spécimen ne correspond' : 'Archive vide'}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13.5, color: 'var(--color-text-secondary)',
        maxWidth: 320, lineHeight: 1.6, margin: 0,
      }}>
        {isFiltered
          ? 'Essayez d\'élargir les filtres ou de modifier la recherche — l\'archive contient peut-être ce que vous cherchez sous un autre angle.'
          : 'Le chargement des données mensuelles n\'a pas abouti. Vérifiez votre connexion.'}
      </p>
    </div>
  )
}
