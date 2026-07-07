export function HeroSection() {
  return (
    <div style={{
      padding: '48px 0 32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="hero-glow" />
      <h1 style={{
        fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px',
        position: 'relative', color: 'var(--color-text-primary)',
        margin: 0,
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Archive
        </span>
        {' '}des idées applicatives
      </h1>
      <p style={{
        color: 'var(--color-text-secondary)',
        fontSize: 14, marginTop: 6, position: 'relative',
      }}>
        Les meilleures idées de{' '}
        <code style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 13,
          background: 'var(--color-background-surface)',
          padding: '2px 8px',
          borderRadius: 4,
          border: '1px solid var(--color-border)',
        }}>
          #cron-idees-apps
        </code>
        {' '}— archivées, classées, filtrées
      </p>
    </div>
  )
}
