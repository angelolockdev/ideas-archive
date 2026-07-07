export function Footer() {
  return (
    <footer style={{
      textAlign: 'center', padding: '28px 0',
      borderTop: '1px solid var(--color-border)',
      marginTop: 40,
    }}>
      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: 0 }}>
        Ideas Archive —{' '}
        <a
          href="https://github.com/angelolockdev/ideas-archive"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
        >
          angelolockdev/ideas-archive
        </a>
        {' '}· Propulsé par{' '}
        <a
          href="https://github.com/facebook/astryx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
        >
          Astryx
        </a>
      </p>
    </footer>
  )
}
