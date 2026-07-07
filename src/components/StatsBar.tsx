interface StatsBarProps {
  stats: {
    total: number
    starred: number
    mada: number
    global: number
  }
}

const ITEMS = [
  { key: 'total',   label: 'Spécimens',     icon: '▾' },
  { key: 'starred', label: 'Coups de cœur', icon: '◆' },
  { key: 'mada',    label: 'Madagascar',     icon: '◎' },
  { key: 'global',  label: 'Global',         icon: '◉' },
] as const

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      role="region"
      aria-label="Statistiques"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        margin: '28px 0',
      }}
    >
      {ITEMS.map(item => {
        const val = stats[item.key]
        return (
          <div
            key={item.key}
            style={{
              background: 'var(--color-background-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-container)',
              padding: '14px 18px',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {val.toLocaleString('fr-FR')}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              marginTop: 6,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--ochre)',
              }}>{item.icon}</span>
              <span className="eyebrow">
                {item.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
