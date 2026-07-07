interface HeroSectionProps {
  totalIdeas: number
}

export function HeroSection({ totalIdeas }: HeroSectionProps) {
  return (
    <div className="hero" style={{ padding: '52px 20px 42px' }}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-halo" aria-hidden="true" />

      <div style={{
        maxWidth: 'var(--app-max-width)',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Eyebrow */}
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          #cron-idees-apps — archive de{' '}
          <span
            className="counter-num"
            style={{ color: 'var(--ochre)', fontSize: 'inherit' }}
            aria-live="polite"
            aria-label={`${totalIdeas} idées archivées`}
          >
            {totalIdeas}
          </span>
          {' '}idées
        </div>

        {/* Display title */}
        <h1 className="hero-title">
          L'archive des<br />
          <span className="ink-mark">meilleures</span> idées
        </h1>

        <p style={{
          marginTop: 20,
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: 480,
        }}>
          Chaque matin, des idées d'application arrivent dans le canal Slack.
          Elles sont archivées ici — classées, datées, filtrables.
        </p>

        {/* Catalog tag */}
        <div style={{ marginTop: 20 }}>
          <code style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            background: 'var(--color-background-surface)',
            border: '1px solid var(--color-border)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-inner)',
            color: 'var(--color-text-secondary)',
          }}>
            SPECIMEN&nbsp;№&nbsp;<span style={{ color: 'var(--ochre)', fontWeight: 600 }}>
              20260705-0001 → …
            </span>
          </code>
        </div>
      </div>
    </div>
  )
}
