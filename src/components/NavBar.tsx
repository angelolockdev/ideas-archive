import { Button } from '@astryxdesign/core/Button'

export function NavBar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'color-mix(in srgb, var(--color-background-body) 85%, transparent)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      height: 56,
    }}>
      <div style={{
        maxWidth: 'var(--app-max-width, 1320px)', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '100%', padding: '0 24px',
      }}>
        <a href="#" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontWeight: 700, fontSize: 16, textDecoration: 'none',
          color: 'var(--color-text-primary)',
        }}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Ideas Archive
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            label="GitHub"
            variant="ghost"
            size="sm"
            href="https://github.com/angelolockdev/ideas-archive"
            target="_blank"
          />
        </div>
      </div>
    </nav>
  )
}
