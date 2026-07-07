import { Button } from '@astryxdesign/core/Button'

interface FilterBarProps {
  monthFilter: string
  catFilter: string
  regionFilter: string
  sourceFilter: string
  searchQuery: string
  bestOnly: boolean
  onMonthChange: (v: string) => void
  onCatChange: (v: string) => void
  onRegionChange: (v: string) => void
  onSourceChange: (v: string) => void
  onSearchChange: (v: string) => void
  onBestToggle: () => void
  availableMonths: string[]
  totalCount: number
  filteredCount: number
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
function mlabel(ym: string) {
  const [y, m] = ym.split('-')
  return `${MONTHS_FR[parseInt(m) - 1]} ${y}`
}

const selectStyle: React.CSSProperties = {
  padding: '7px 10px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  background: 'var(--color-background-body)',
  color: 'var(--color-text-primary)',
  fontSize: 12.5,
  cursor: 'pointer',
  minWidth: 0,
  outline: 'none',
}

const inputStyle: React.CSSProperties = {
  ...selectStyle,
  width: '100%',
  paddingLeft: 28,
  cursor: 'text',
}

export function FilterBar({
  monthFilter, catFilter, regionFilter, sourceFilter,
  searchQuery, bestOnly,
  onMonthChange, onCatChange, onRegionChange, onSourceChange,
  onSearchChange, onBestToggle,
  availableMonths, totalCount, filteredCount,
}: FilterBarProps) {
  return (
    <div style={{
      background: 'var(--color-background-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-container)',
      padding: '14px 18px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <select value={monthFilter} onChange={e => onMonthChange(e.target.value)} style={selectStyle}>
          <option value="all">Tous les mois</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{mlabel(m)}</option>
          ))}
        </select>

        <select value={catFilter} onChange={e => onCatChange(e.target.value)} style={selectStyle}>
          <option value="all">Toutes catégories</option>
          <option value="productivity">Productivité</option>
          <option value="ai">IA / ML</option>
          <option value="fintech">Fintech</option>
          <option value="health">Santé</option>
          <option value="transport">Transport</option>
          <option value="climate">Climat</option>
          <option value="social">Social</option>
          <option value="edtech">Éducation</option>
          <option value="devtools">DevTools</option>
          <option value="iot">IoT</option>
          <option value="other">Autre</option>
        </select>

        <select value={regionFilter} onChange={e => onRegionChange(e.target.value)} style={selectStyle}>
          <option value="all">Toutes régions</option>
          <option value="global">Global</option>
          <option value="madagascar">Madagascar</option>
        </select>

        <select value={sourceFilter} onChange={e => onSourceChange(e.target.value)} style={selectStyle}>
          <option value="all">Toutes sources</option>
          <option value="idees-matin">Idées du matin</option>
          <option value="self-improving">Self-Improving</option>
        </select>

        <div style={{ position: 'relative', flex: 1, minWidth: 140, maxWidth: 220 }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', fontSize: 13, pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Rechercher..."
            style={inputStyle}
          />
        </div>

        <Button
          label={bestOnly ? '★ Meilleures' : '☆ Meilleures'}
          variant={bestOnly ? 'primary' : 'secondary'}
          size="sm"
          onClick={onBestToggle}
        />

        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
          {filteredCount} / {totalCount}
        </span>
      </div>
    </div>
  )
}
