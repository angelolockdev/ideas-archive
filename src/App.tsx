import { useState, useEffect, useCallback } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import type { Idea, MonthlyData, Category } from './types'
import { MONTHS_FR } from './types'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { StatsBar } from './components/StatsBar'
import { FilterBar } from './components/FilterBar'
import { IdeaGrid } from './components/IdeaGrid'
import { AgentChat } from './components/AgentChat'
import { Footer } from './components/Footer'

const MONTHS = ['2026-07', '2026-06']

function formatMonth(ym: string) {
  const [y, m] = ym.split('-')
  return `${MONTHS_FR[parseInt(m) - 1]} ${y}`
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  return `${parseInt(day)} ${MONTHS_FR[parseInt(m) - 1].substring(0, 3)} ${y}`
}

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [monthFilter, setMonthFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bestOnly, setBestOnly] = useState(false)

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
        } catch {
          // skip missing months
        }
      }

      // Restore stars
      try {
        const stars: string[] = JSON.parse(localStorage.getItem('ia-stars') || '[]')
        stars.forEach(id => {
          const idea = all.find(i => i.id === id)
          if (idea) idea.status = 'starred'
        })
      } catch {
        // ignore
      }

      setIdeas(all)
      setLoading(false)
    }
    load()
  }, [])

  // Persist stars
  const toggleStar = useCallback((id: string) => {
    setIdeas(prev => {
      const next = prev.map(i => {
        if (i.id !== id) return i
        return { ...i, status: (i.status === 'starred' ? 'pending' : 'starred') as 'pending' | 'starred' }
      })
      const starred = next.filter(i => i.status === 'starred').map(i => i.id)
      localStorage.setItem('ia-stars', JSON.stringify(starred))
      return next
    })
  }, [])

  // Filter ideas
  const filtered = ideas.filter(i => {
    if (monthFilter !== 'all' && i.date.substring(0, 7) !== monthFilter) return false
    if (catFilter !== 'all' && i.category !== catFilter) return false
    if (regionFilter !== 'all' && i.region !== regionFilter) return false
    if (sourceFilter !== 'all' && i.source !== sourceFilter) return false
    if (bestOnly && i.status !== 'starred') return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const haystack = [i.title, i.description, i.problem, i.market, i.stack, i.theme]
        .filter(Boolean).join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  // Group by month
  const grouped = filtered.reduce<Record<string, Idea[]>>((acc, idea) => {
    const m = idea.date.substring(0, 7)
    if (!acc[m]) acc[m] = []
    acc[m].push(idea)
    return acc
  }, {})

  const groupKeys = Object.keys(grouped).sort().reverse()

  // Stats
  const stats = {
    total: ideas.length,
    starred: ideas.filter(i => i.status === 'starred').length,
    mada: ideas.filter(i => i.region === 'madagascar').length,
    global: ideas.filter(i => i.region === 'global').length,
  }

  // Available months from data
  const availableMonths = [...new Set(ideas.map(i => i.date.substring(0, 7)))].sort().reverse()

  return (
    <Theme theme={neutralTheme}>
      <div style={{ minHeight: '100vh' }}>
        <NavBar />
        <HeroSection />

        <div style={{ maxWidth: 'var(--app-max-width, 1320px)', margin: '0 auto', padding: '0 24px' }}>
          <StatsBar stats={stats} />

          <FilterBar
            monthFilter={monthFilter}
            catFilter={catFilter}
            regionFilter={regionFilter}
            sourceFilter={sourceFilter}
            searchQuery={searchQuery}
            bestOnly={bestOnly}
            onMonthChange={setMonthFilter}
            onCatChange={setCatFilter}
            onRegionChange={setRegionFilter}
            onSourceChange={setSourceFilter}
            onSearchChange={setSearchQuery}
            onBestToggle={() => setBestOnly(!bestOnly)}
            availableMonths={availableMonths}
            totalCount={ideas.length}
            filteredCount={filtered.length}
          />

          <IdeaGrid
            groups={grouped}
            groupKeys={groupKeys}
            toggleStar={toggleStar}
            formatMonth={formatMonth}
            formatDate={formatDate}
            loading={loading}
          />
        </div>

        <Footer />

        <AgentChat ideas={ideas} />
      </div>
    </Theme>
  )
}
