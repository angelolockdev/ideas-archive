interface StatsBarProps {
  stats: {
    total: number
    starred: number
    mada: number
    global: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { value: stats.total, label: 'Idées', color: 'var(--color-accent)' },
    { value: stats.starred, label: 'Coups de cœur', color: '#f59e0b' },
    { value: stats.mada, label: 'Madagascar 🇲🇬', color: '#a78bfa' },
    { value: stats.global, label: 'Global 🌍', color: '#34d399' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
      gap: 10,
      marginBottom: 24,
    }}>
      {items.map(item => (
        <div key={item.label} style={{
          background: 'var(--color-background-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-element)',
          padding: '12px 16px',
          textAlign: 'center',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2, color: item.color }}>
            {item.value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
