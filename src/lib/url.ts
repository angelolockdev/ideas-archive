import type { PageTab } from '../types'

/**
 * Encode/decode app filter state to/from URLSearchParams for shareable links.
 * Sections and detail records use a hash route so direct GitHub Pages links work.
 */

export interface FilterState {
  monthFilter:  string
  catFilter:    string
  regionFilter: string
  sourceFilter: string
  searchQuery:  string
  bestOnly:     boolean
}

const DEFAULTS: FilterState = {
  monthFilter:  'all',
  catFilter:    'all',
  regionFilter: 'all',
  sourceFilter: 'all',
  searchQuery:  '',
  bestOnly:     false,
}

const VALID_TABS: readonly PageTab[] = ['ideas', 'niches', 'jobs', 'trading']

export interface RouteState {
  tab: PageTab
  detailId: string | null
}

function isPageTab(value: string): value is PageTab {
  return VALID_TABS.includes(value as PageTab)
}

export function decodeRoute(hash = window.location.hash): RouteState {
  const [tabPart, detailPart] = hash.replace(/^#\/?/, '').split('/')
  const tab = isPageTab(tabPart) ? tabPart : 'ideas'

  if (!detailPart) return { tab, detailId: null }

  try {
    return { tab, detailId: decodeURIComponent(detailPart) }
  } catch {
    return { tab, detailId: null }
  }
}

export function encodeRoute(tab: PageTab, detailId: string | null = null): string {
  return `#/${tab}${detailId ? `/${encodeURIComponent(detailId)}` : ''}`
}

export function encodeFilters(state: FilterState): string {
  const params = new URLSearchParams()
  if (state.monthFilter  !== DEFAULTS.monthFilter)  params.set('month',  state.monthFilter)
  if (state.catFilter    !== DEFAULTS.catFilter)    params.set('cat',    state.catFilter)
  if (state.regionFilter !== DEFAULTS.regionFilter) params.set('region', state.regionFilter)
  if (state.sourceFilter !== DEFAULTS.sourceFilter) params.set('source', state.sourceFilter)
  if (state.searchQuery  !== DEFAULTS.searchQuery)  params.set('q',      state.searchQuery)
  if (state.bestOnly)                                params.set('best',   '1')
  const str = params.toString()
  return str
    ? `${window.location.pathname}?${str}${window.location.hash}`
    : `${window.location.pathname}${window.location.hash}`
}

export function decodeFilters(): FilterState {
  const params = new URLSearchParams(window.location.search)
  return {
    monthFilter:  params.get('month')  ?? DEFAULTS.monthFilter,
    catFilter:    params.get('cat')    ?? DEFAULTS.catFilter,
    regionFilter: params.get('region') ?? DEFAULTS.regionFilter,
    sourceFilter: params.get('source') ?? DEFAULTS.sourceFilter,
    searchQuery:  params.get('q')      ?? DEFAULTS.searchQuery,
    bestOnly:     params.get('best')   === '1',
  }
}

export function isFiltered(state: FilterState): boolean {
  return (
    state.monthFilter  !== DEFAULTS.monthFilter  ||
    state.catFilter    !== DEFAULTS.catFilter    ||
    state.regionFilter !== DEFAULTS.regionFilter ||
    state.sourceFilter !== DEFAULTS.sourceFilter ||
    state.searchQuery  !== DEFAULTS.searchQuery  ||
    state.bestOnly
  )
}

export function safeExternalHref(value?: string): string | null {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}
