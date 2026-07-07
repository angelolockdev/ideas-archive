export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      marginTop: 60,
      padding: '28px 20px',
    }}>
      <div style={{
        maxWidth: 'var(--app-max-width)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span className="eyebrow">
          The Idea Ledger — archivé depuis{' '}
          <span style={{ color: 'var(--ochre)' }}>#cron-idees-apps</span>
        </span>

        <div style={{ display: 'flex', gap: 16 }}>
          <a
            href="https://github.com/angelolockdev/ideas-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow"
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
            aria-label="Code source sur GitHub"
          >
            GitHub ↗
          </a>
          <a
            href="https://github.com/facebook/astryx"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow"
            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
            aria-label="Design system Astryx"
          >
            Astryx ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
