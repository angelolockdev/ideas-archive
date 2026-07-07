/**
 * Encode/decode app filter state to/from URLSearchParams for shareable links.
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

export function encodeFilters(state: FilterState): string {
  const params = new URLSearchParams()
  if (state.monthFilter  !== DEFAULTS.monthFilter)  params.set('month',  state.monthFilter)
  if (state.catFilter    !== DEFAULTS.catFilter)    params.set('cat',    state.catFilter)
  if (state.regionFilter !== DEFAULTS.regionFilter) params.set('region', state.regionFilter)
  if (state.sourceFilter !== DEFAULTS.sourceFilter) params.set('source', state.sourceFilter)
  if (state.searchQuery  !== DEFAULTS.searchQuery)  params.set('q',      state.searchQuery)
  if (state.bestOnly)                                params.set('best',   '1')
  const str = params.toString()
  return str ? `${window.location.pathname}${window.location.hash}?${str}` : window.location.pathname
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
