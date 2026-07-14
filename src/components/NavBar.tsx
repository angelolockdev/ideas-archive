import { Button } from '@astryxdesign/core/Button'
import type { PageTab } from '../types'

interface NavBarProps {
  themeMode: 'light' | 'dark' | 'system'
  onThemeToggle: () => void
  activeTab: PageTab
  onTabChange: (tab: PageTab) => void
  ideaCount: number
  nicheCount: number
  jobCount: number
  tradingCount: number
}

export function NavBar({ themeMode, onThemeToggle, activeTab, onTabChange, ideaCount, nicheCount, jobCount, tradingCount }: NavBarProps) {
  const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <nav
      aria-label="Navigation principale"
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'color-mix(in srgb, var(--color-background-body) 85%, transparent)',
        backdropFilter: 'blur(16px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="nav-inner" style={{
        maxWidth: 'var(--app-max-width)', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52, padding: '0 20px',
      }}>
        {/* Logotype */}
        <a
          href="#/ideas"
          aria-label="Ideas Archive — retour à l'accueil"
          style={{ display: 'flex', alignItems: 'baseline', gap: 8, textDecoration: 'none', flexShrink: 0 }}
        >
          <span className="brand-mark" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ochre)',
            letterSpacing: '0.1em',
            userSelect: 'none',
          }}>▾ IA</span>
          <span className="brand-name" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.01em',
          }}>
            The Idea Ledger
          </span>
        </a>

        {/* Tabs */}
        <div className="nav-tabs" role="tablist" aria-label="Vues" style={{ display: 'flex', gap: 2, marginLeft: 24 }}>
          <button
            role="tab"
            aria-selected={activeTab === 'ideas'}
            onClick={() => onTabChange('ideas')}
            className={`nav-tab ${activeTab === 'ideas' ? 'active' : ''}`}
          >
            <span>💡 Idées</span>
            <span className="nav-tab-count">{ideaCount}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'niches'}
            onClick={() => onTabChange('niches')}
            className={`nav-tab ${activeTab === 'niches' ? 'active' : ''}`}
          >
            <span>📊 Niches</span>
            <span className="nav-tab-count">{nicheCount}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'jobs'}
            onClick={() => onTabChange('jobs')}
            className={`nav-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            <span>💼 Jobs</span>
            <span className="nav-tab-count">{jobCount}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'trading'}
            onClick={() => onTabChange('trading')}
            className={`nav-tab ${activeTab === 'trading' ? 'active' : ''}`}
          >
            <span>📈 Trading</span>
            <span className="nav-tab-count">{tradingCount}</span>
          </button>
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34,
              borderRadius: 'var(--radius-element)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 15,
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>

          <Button
            label="GitHub"
            variant="ghost"
            size="sm"
            href="https://github.com/angelolockdev/ideas-archive"
            target="_blank"
            aria-label="Voir le code source sur GitHub"
          />
        </div>
      </div>
    </nav>
  )
}
