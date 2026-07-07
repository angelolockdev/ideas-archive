import { Spinner } from '@astryxdesign/core/Spinner'
import { IdeaCard } from './IdeaCard'
import type { Idea } from '../types'

interface IdeaGridProps {
  groups: Record<string, Idea[]>
  groupKeys: string[]
  toggleStar: (id: string) => void
  formatMonth: (ym: string) => string
  formatDate: (d: string) => string
  loading: boolean
}

export function IdeaGrid({ groups, groupKeys, toggleStar, formatMonth, formatDate, loading }: IdeaGridProps) {
  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '100px 20px', gap: 14,
      }}>
        <Spinner size="lg" label="Chargement des idées..." />
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Chargement des idées...</p>
      </div>
    )
  }

  if (groupKeys.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        color: 'var(--color-text-tertiary)',
      }}>
        <div style={{ fontSize: 44, marginBottom: 10, opacity: 0.5 }}>💡</div>
        <h3 style={{ fontSize: 17, marginBottom: 4, color: 'var(--color-text-primary)' }}>
          Aucune idée trouvée
        </h3>
        <p style={{ fontSize: 13 }}>Essayez de modifier les filtres.</p>
      </div>
    )
  }

  return (
    <>
      {groupKeys.map(month => {
        const monthIdeas = groups[month].sort((a, b) => b.date.localeCompare(a.date))
        return (
          <div key={month} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 14, paddingBottom: 8,
              borderBottom: '1px solid var(--color-border)',
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                {formatMonth(month)}
              </h2>
              <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
                {monthIdeas.length} idée{monthIdeas.length > 1 ? 's' : ''}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 14,
            }}>
              {monthIdeas.map((idea, i) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={i}
                  toggleStar={toggleStar}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}
