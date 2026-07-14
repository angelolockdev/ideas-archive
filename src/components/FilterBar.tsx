import { useMemo, useCallback, useRef, useState } from 'react'
import type { Idea, Category, Collection, ViewMode, PageTab } from '../types'
import { CATEGORIES, MONTHS_FR } from '../types'
import { encodeFilters } from '../lib/url'

interface FilterBarProps {
  ideas: Idea[]
  monthFilter: string
  catFilter: string
  regionFilter: string
  sourceFilter: string
  searchQuery: string
  bestOnly: boolean
  viewMode: ViewMode
  collections: Collection[]
  onMonthChange: (v: string) => void
  onCatChange: (v: string) => void
  onRegionChange: (v: string) => void
  onSourceChange: (v: string) => void
  onSearchChange: (v: string) => void
  onBestToggle: () => void
  onViewModeChange: (v: ViewMode) => void
  onResetFilters: () => void
  onCollectionCreate: (name: string) => void
  onCollectionSelect: (id: string | null) => void
  selectedCollection: string | null
  availableMonths: string[]
  filteredCount: number
  isFiltered: boolean
  activeTab: PageTab
}

const ITEM_LABELS: Record<PageTab, { singular: string; plural: string }> = {
  ideas: { singular: 'idée', plural: 'idées' },
  niches: { singular: 'niche', plural: 'niches' },
  jobs: { singular: 'offre', plural: 'offres' },
  trading: { singular: 'stratégie', plural: 'stratégies' },
}

function mlabel(ym: string) {
  const [y, m] = ym.split('-')
  return `${MONTHS_FR[parseInt(m) - 1]} ${y}`
}

export function FilterBar({
  ideas, monthFilter, catFilter, regionFilter, sourceFilter,
  searchQuery, bestOnly, viewMode, collections, selectedCollection,
  onMonthChange, onCatChange, onRegionChange, onSourceChange,
  onSearchChange, onBestToggle, onViewModeChange, onResetFilters,
  onCollectionCreate, onCollectionSelect,
  availableMonths, filteredCount, isFiltered,
  activeTab,
}: FilterBarProps) {
  const [newColName, setNewColName] = useState('')
  const [colOpen, setColOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const itemLabel = ITEM_LABELS[activeTab]

  // Per-category counts
  const catCounts = useMemo(() => {
    const counts: Partial<Record<Category | 'all', number>> = { all: ideas.length }
    ideas.forEach(i => {
      counts[i.category] = (counts[i.category] ?? 0) + 1
    })
    return counts
  }, [ideas])

  // Per-region counts
  const regionCounts = useMemo(() => ({
    all: ideas.length,
    global: ideas.filter(i => i.region === 'global').length,
    madagascar: ideas.filter(i => i.region === 'madagascar').length,
  }), [ideas])

  // Per-source counts
  const sourceCounts = useMemo(() => ({
    all: ideas.length,
    'idees-matin': ideas.filter(i => i.source === 'idees-matin').length,
    'self-improving': ideas.filter(i => i.source === 'self-improving').length,
    'scan-niches': ideas.filter(i => i.source === 'scan-niches').length,
    'freelance': ideas.filter(i => i.source === 'freelance').length,
    'trading': ideas.filter(i => i.source === 'trading').length,
  }), [ideas])

  const handleShare = useCallback(() => {
    const url = encodeFilters({ monthFilter, catFilter, regionFilter, sourceFilter, searchQuery, bestOnly })
    const full = `${window.location.origin}${url}`
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }, [monthFilter, catFilter, regionFilter, sourceFilter, searchQuery, bestOnly])

  const handleCreateCollection = useCallback(() => {
    const name = newColName.trim()
    if (!name) return
    onCollectionCreate(name)
    setNewColName('')
    setColOpen(false)
  }, [newColName, onCollectionCreate])

  return (
    <div className="filter-bar" style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-container)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      {/* Row 1: filters */}
      <div className="filter-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Month */}
        <select
          value={monthFilter}
          onChange={e => onMonthChange(e.target.value)}
          className="ledger-select"
          aria-label="Filtrer par mois"
        >
          <option value="all">Tous les mois ({ideas.length})</option>
          {availableMonths.map(m => {
            const c = ideas.filter(i => i.date.startsWith(m)).length
            return <option key={m} value={m}>{mlabel(m)} ({c})</option>
          })}
        </select>

        {/* Category */}
        <select
          value={catFilter}
          onChange={e => onCatChange(e.target.value)}
          className="ledger-select"
          aria-label="Filtrer par catégorie"
        >
          <option value="all">Catégories ({catCounts.all ?? 0})</option>
          {(Object.keys(CATEGORIES) as Category[]).map(c => (
            <option key={c} value={c}>
              {CATEGORIES[c]} ({catCounts[c] ?? 0})
            </option>
          ))}
        </select>

        {/* Region */}
        <select
          value={regionFilter}
          onChange={e => onRegionChange(e.target.value)}
          className="ledger-select"
          aria-label="Filtrer par région"
        >
          <option value="all">Régions ({regionCounts.all})</option>
          <option value="global">Global ({regionCounts.global})</option>
          <option value="madagascar">Madagascar ({regionCounts.madagascar})</option>
        </select>

        {/* Source */}
        <select
          value={sourceFilter}
          onChange={e => onSourceChange(e.target.value)}
          className="ledger-select"
          aria-label="Filtrer par source"
        >
          <option value="all">Sources ({sourceCounts.all})</option>
          <option value="idees-matin">Idées du matin ({sourceCounts['idees-matin']})</option>
          <option value="self-improving">Self-Improving ({sourceCounts['self-improving']})</option>
          <option value="scan-niches">Niches Business ({sourceCounts['scan-niches']})</option>
          <option value="freelance">Emplois Tech ({sourceCounts['freelance']})</option>
          <option value="trading">Stratégies Trading ({sourceCounts['trading']})</option>
        </select>

        {/* Search */}
        <div className="filter-search" style={{ position: 'relative', flex: 1, minWidth: 140, maxWidth: 220 }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              pointerEvents: 'none',
            }}
          >⌕</span>
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={`Rechercher une ${itemLabel.singular}…`}
            className="ledger-search"
            aria-label="Rechercher"
          />
        </div>

        {/* Best toggle */}
        <button
          onClick={onBestToggle}
          aria-pressed={bestOnly}
          aria-label={bestOnly ? 'Afficher tout' : 'Afficher seulement les favoris'}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 12px',
            borderRadius: 'var(--radius-element)',
            border: `1px solid ${bestOnly ? 'var(--ochre-line)' : 'var(--color-border)'}`,
            background: bestOnly ? 'var(--ochre-tint)' : 'transparent',
            color: bestOnly ? 'var(--ochre)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{bestOnly ? '◆' : '◇'}</span>
          Favoris
        </button>
      </div>

      {/* Row 2: tools */}
      <div className="filter-tools" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 10, flexWrap: 'wrap',
      }}>
        {/* View mode toggle */}
        <div
          role="group"
          aria-label="Mode d'affichage"
          style={{ display: 'flex', gap: 2, background: 'var(--color-background-body)', borderRadius: 'var(--radius-element)', padding: 2 }}
        >
          {(['grid', 'list'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              aria-pressed={viewMode === mode}
              aria-label={mode === 'grid' ? 'Vue grille' : 'Vue liste'}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: 'none',
                background: viewMode === mode ? 'var(--color-background-surface)' : 'transparent',
                color: viewMode === mode ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                fontSize: 13,
                boxShadow: viewMode === mode ? 'var(--shadow-low)' : 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {mode === 'grid' ? '⊞' : '≡'}
            </button>
          ))}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          aria-label="Copier le lien avec les filtres"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 11px',
            borderRadius: 'var(--radius-element)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: copied ? 'var(--ochre)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            cursor: 'pointer',
            transition: 'color 0.2s ease, border-color 0.2s ease',
            borderColor: copied ? 'var(--ochre-line)' : undefined,
          }}
        >
          {copied ? '✓ Copié' : '⤴ Partager'}
        </button>

        {/* Collections */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setColOpen(o => !o)}
            aria-expanded={colOpen}
            aria-haspopup="listbox"
            aria-label="Collections personnalisées"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px',
              borderRadius: 'var(--radius-element)',
              border: `1px solid ${selectedCollection ? 'var(--ochre-line)' : 'var(--color-border)'}`,
              background: selectedCollection ? 'var(--ochre-tint)' : 'transparent',
              color: selectedCollection ? 'var(--ochre)' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              cursor: 'pointer',
            }}
          >
            ◈ Collections{collections.length > 0 ? ` (${collections.length})` : ''}
          </button>
          {colOpen && (
            <div
              role="listbox"
              aria-label="Collections"
              style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                zIndex: 500,
                background: 'var(--color-background-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-container)',
                boxShadow: 'var(--shadow-high)',
                minWidth: 220, maxWidth: 280,
                padding: 8,
                animation: 'rise 0.15s ease both',
              }}
            >
              <button
                role="option"
                aria-selected={selectedCollection === null}
                onClick={() => { onCollectionSelect(null); setColOpen(false) }}
                style={colItemStyle(selectedCollection === null)}
              >
                Toutes les idées
              </button>
              {collections.map(col => (
                <button
                  key={col.id}
                  role="option"
                  aria-selected={selectedCollection === col.id}
                  onClick={() => { onCollectionSelect(col.id); setColOpen(false) }}
                  style={colItemStyle(selectedCollection === col.id)}
                >
                  <span>{col.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-text-tertiary)' }}>
                    {col.ideaIds.length}
                  </span>
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 6, paddingTop: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={newColName}
                    onChange={e => setNewColName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateCollection() }}
                    placeholder="Nouvelle collection…"
                    aria-label="Nom de la nouvelle collection"
                    className="ledger-search"
                    style={{ fontSize: 12, padding: '5px 9px' }}
                  />
                  <button
                    onClick={handleCreateCollection}
                    disabled={!newColName.trim()}
                    aria-label="Créer la collection"
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-inner)',
                      border: 'none',
                      background: newColName.trim() ? 'var(--ochre)' : 'var(--color-border)',
                      color: newColName.trim() ? '#fff' : 'var(--color-text-tertiary)',
                      cursor: newColName.trim() ? 'pointer' : 'default',
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                    }}
                  >+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result count + reset */}
        <div className="filter-result" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="eyebrow"
            aria-live="polite"
            aria-label={`${filteredCount} élément${filteredCount > 1 ? 's' : ''} affiché${filteredCount > 1 ? 's' : ''}`}
          >
            {filteredCount}&nbsp;{filteredCount > 1 ? itemLabel.plural : itemLabel.singular}
          </span>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              aria-label="Réinitialiser tous les filtres"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--radius-element)',
                border: '1px solid var(--ochre-line)',
                background: 'var(--ochre-tint)',
                color: 'var(--ochre)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                animation: 'rise 0.2s ease both',
              }}
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function colItemStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', textAlign: 'left',
    padding: '7px 10px',
    borderRadius: 6,
    border: 'none',
    background: selected ? 'var(--ochre-tint)' : 'transparent',
    color: selected ? 'var(--ochre)' : 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 12.5,
    cursor: 'pointer',
    transition: 'background 0.12s ease',
  }
}
