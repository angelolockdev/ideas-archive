import { useState, useEffect, useCallback, useMemo } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import type { Idea, MonthlyData, Category, Collection, ViewMode } from './types'
import { MONTHS_FR } from './types'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { StatsBar } from './components/StatsBar'
import { FilterBar } from './components/FilterBar'
import { IdeaGrid } from './components/IdeaGrid'
import { IdeaDetail } from './components/IdeaDetail'
import { AgentChat } from './components/AgentChat'
import { Footer } from './components/Footer'
import { decodeFilters, isFiltered as checkFiltered } from './lib/url'

const MONTHS = ['2026-07', '2026-06']

function formatMonth(ym: string) {
  const [y, m] = ym.split('-')
  return `${MONTHS_FR[parseInt(m) - 1]} ${y}`
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${parseInt(day)} ${MONTHS_FR[parseInt(m) - 1].substring(0, 3)}. ${y}`
}

type ThemeMode = 'light' | 'dark' | 'system'

function nextTheme(mode: ThemeMode): ThemeMode {
  return mode === 'system' ? 'dark' : mode === 'dark' ? 'light' : 'system'
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

function loadCollections(): Collection[] {
  try {
    return JSON.parse(localStorage.getItem('ia-collections') || '[]')
  } catch { return [] }
}

export default function App() {
  const [ideas, setIdeas]   = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  // Read initial filters from URL (for share links)
  const initialFilters = useMemo(() => decodeFilters(), [])

  const [monthFilter,  setMonthFilter]  = useState(initialFilters.monthFilter)
  const [catFilter,    setCatFilter]    = useState(initialFilters.catFilter)
  const [regionFilter, setRegionFilter] = useState(initialFilters.regionFilter)
  const [sourceFilter, setSourceFilter] = useState(initialFilters.sourceFilter)
  const [searchQuery,  setSearchQuery]  = useState(initialFilters.searchQuery)
  const [bestOnly,     setBestOnly]     = useState(initialFilters.bestOnly)
  const [viewMode,     setViewMode]     = useState<ViewMode>('grid')

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try { return (localStorage.getItem('ia-theme') as ThemeMode) || 'system' } catch { return 'system' }
  })

  const [collections, setCollections] = useState<Collection[]>(loadCollections)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const [detailIdea, setDetailIdea] = useState<Idea | null>(null)

  // Load data
  useEffect(() => {
    async function load() {
      setLoading(true)
      const all: Idea[] = []
      for (const m of MONTHS) {
        try {
          const resp = await fetch(`data/${m}.json`)
          if (!resp.ok) continue
          const data: MonthlyData = await resp.json()
          all.push(...(data.ideas || []))
        } catch { /* skip missing months */ }
      }
      // Restore stars
      try {
        const stars: string[] = JSON.parse(localStorage.getItem('ia-stars') || '[]')
        stars.forEach(id => {
          const idea = all.find(i => i.id === id)
          if (idea) idea.status = 'starred'
        })
      } catch { /* ignore */ }
      setIdeas(all)
      setLoading(false)
    }
    load()
  }, [])

  // Theme persistence + sync to <html>
  useEffect(() => {
    try { localStorage.setItem('ia-theme', themeMode) } catch { /* ignore */ }
  }, [themeMode])

  const handleThemeToggle = useCallback(() => {
    setThemeMode(m => nextTheme(m))
  }, [])

  // Persist collections
  useEffect(() => {
    try { localStorage.setItem('ia-collections', JSON.stringify(collections)) } catch { /* ignore */ }
  }, [collections])

  // Star toggle
  const toggleStar = useCallback((id: string) => {
    setIdeas(prev => {
      const next = prev.map(i =>
        i.id !== id ? i : { ...i, status: (i.status === 'starred' ? 'pending' : 'starred') as 'pending' | 'starred' }
      )
      const starred = next.filter(i => i.status === 'starred').map(i => i.id)
      try { localStorage.setItem('ia-stars', JSON.stringify(starred)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setMonthFilter('all')
    setCatFilter('all')
    setRegionFilter('all')
    setSourceFilter('all')
    setSearchQuery('')
    setBestOnly(false)
    setSelectedCollection(null)
  }, [])

  // Collections CRUD
  const createCollection = useCallback((name: string) => {
    const col: Collection = {
      id: `col-${Date.now()}`,
      name,
      ideaIds: [],
      createdAt: Date.now(),
    }
    setCollections(prev => [...prev, col])
  }, [])

  const addToCollection = useCallback((ideaId: string, colId: string) => {
    setCollections(prev =>
      prev.map(c => c.id !== colId ? c : {
        ...c,
        ideaIds: c.ideaIds.includes(ideaId) ? c.ideaIds : [...c.ideaIds, ideaId],
      })
    )
  }, [])

  // Filter ideas (memoized)
  const filtered = useMemo(() => {
    let pool = ideas

    // Collection filter (pre-filter before other filters)
    if (selectedCollection) {
      const col = collections.find(c => c.id === selectedCollection)
      if (col) pool = pool.filter(i => col.ideaIds.includes(i.id))
    }

    return pool.filter(i => {
      if (monthFilter  !== 'all' && i.date.substring(0, 7) !== monthFilter)   return false
      if (catFilter    !== 'all' && i.category  !== (catFilter as Category))  return false
      if (regionFilter !== 'all' && i.region    !== regionFilter)             return false
      if (sourceFilter !== 'all' && i.source    !== sourceFilter)             return false
      if (bestOnly && i.status !== 'starred')                                 return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const haystack = [i.title, i.description, i.problem, i.market, i.stack, i.theme]
          .filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [ideas, monthFilter, catFilter, regionFilter, sourceFilter, bestOnly, searchQuery, selectedCollection, collections])

  // Group by month (memoized)
  const { grouped, groupKeys } = useMemo(() => {
    const grouped = filtered.reduce<Record<string, Idea[]>>((acc, idea) => {
      const m = idea.date.substring(0, 7)
      if (!acc[m]) acc[m] = []
      acc[m].push(idea)
      return acc
    }, {})
    const groupKeys = Object.keys(grouped).sort().reverse()
    return { grouped, groupKeys }
  }, [filtered])

  // Stats (memoized)
  const stats = useMemo(() => ({
    total:   ideas.length,
    starred: ideas.filter(i => i.status === 'starred').length,
    mada:    ideas.filter(i => i.region === 'madagascar').length,
    global:  ideas.filter(i => i.region === 'global').length,
  }), [ideas])

  const availableMonths = useMemo(
    () => [...new Set(ideas.map(i => i.date.substring(0, 7)))].sort().reverse(),
    [ideas],
  )

  const filterState = useMemo(
    () => ({ monthFilter, catFilter, regionFilter, sourceFilter, searchQuery, bestOnly }),
    [monthFilter, catFilter, regionFilter, sourceFilter, searchQuery, bestOnly],
  )

  const hasFilters = useMemo(() => checkFiltered(filterState), [filterState])

  // Detail navigation — index into the currently filtered flat list
  const flatFiltered = useMemo(
    () => groupKeys.flatMap(k => grouped[k] ?? []).sort((a, b) => b.date.localeCompare(a.date)),
    [grouped, groupKeys],
  )

  const detailIdx = useMemo(
    () => detailIdea ? flatFiltered.findIndex(i => i.id === detailIdea.id) : -1,
    [detailIdea, flatFiltered],
  )

  const openDetail = useCallback((idea: Idea) => setDetailIdea(idea), [])
  const closeDetail = useCallback(() => setDetailIdea(null), [])
  const navigateDetail = useCallback((idea: Idea) => setDetailIdea(idea), [])

  const prevIdea = detailIdx > 0 ? flatFiltered[detailIdx - 1] : null
  const nextIdea = detailIdx < flatFiltered.length - 1 ? flatFiltered[detailIdx + 1] : null

  const resolvedMode = resolveMode(themeMode)

  return (
    <Theme theme={neutralTheme} mode={resolvedMode}>
      <div style={{ minHeight: '100vh', background: 'var(--color-background-body)' }}>
        <NavBar themeMode={themeMode} onThemeToggle={handleThemeToggle} />

        <main>
          <HeroSection totalIdeas={ideas.length} />

          <div style={{ maxWidth: 'var(--app-max-width)', margin: '0 auto', padding: '0 20px' }}>
            <StatsBar stats={stats} />

            <FilterBar
              ideas={ideas}
              monthFilter={monthFilter}
              catFilter={catFilter}
              regionFilter={regionFilter}
              sourceFilter={sourceFilter}
              searchQuery={searchQuery}
              bestOnly={bestOnly}
              viewMode={viewMode}
              collections={collections}
              selectedCollection={selectedCollection}
              onMonthChange={setMonthFilter}
              onCatChange={setCatFilter}
              onRegionChange={setRegionFilter}
              onSourceChange={setSourceFilter}
              onSearchChange={setSearchQuery}
              onBestToggle={() => setBestOnly(b => !b)}
              onViewModeChange={setViewMode}
              onResetFilters={resetFilters}
              onCollectionCreate={createCollection}
              onCollectionSelect={setSelectedCollection}
              availableMonths={availableMonths}
              filteredCount={filtered.length}
              isFiltered={hasFilters || selectedCollection !== null}
            />

            <IdeaGrid
              groups={grouped}
              groupKeys={groupKeys}
              toggleStar={toggleStar}
              formatMonth={formatMonth}
              formatDate={formatDate}
              loading={loading}
              viewMode={viewMode}
              isFiltered={hasFilters}
              onOpenDetail={openDetail}
              collections={collections}
              onAddToCollection={addToCollection}
            />
          </div>
        </main>

        <Footer />

        <AgentChat ideas={ideas} />

        {detailIdea && (
          <IdeaDetail
            idea={detailIdea}
            prevIdea={prevIdea}
            nextIdea={nextIdea}
            onClose={closeDetail}
            onNavigate={navigateDetail}
            toggleStar={toggleStar}
            formatDate={formatDate}
          />
        )}
      </div>
    </Theme>
  )
}
