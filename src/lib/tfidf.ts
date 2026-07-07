/**
 * TF-IDF semantic search engine (French, TypeScript, no external deps).
 * Used by AgentChat for ranked idea retrieval.
 */

import type { Idea } from '../types'

const FR_STOPWORDS = new Set([
  'le','la','les','un','une','des','du','de','et','en','à','au','aux','par',
  'pour','sur','dans','avec','qui','que','quoi','dont','où','est','son','sa',
  'ses','mon','ma','mes','ton','ta','tes','il','elle','nous','vous','ils',
  'elles','je','tu','ce','cet','cette','ces','se','si','ne','pas','plus',
  'mais','ou','et','donc','or','ni','car','très','tout','tous','toute',
  'toutes','bien','leur','leurs','même','aussi','plus','moins','puis','été',
  'être','avoir','fait','faire','peut','peuvent','pouvoir','sont','ont',
  'comme','entre','sans','sous','vers','selon','lors','lors','après','avant',
  'chez','depuis','pendant','lors','dont','dont','dans','autre','autres',
  'quel','quelle','quels','quelles','non','oui','votre','notre','notre',
  'vos','nos','ainsi','alors','comment','pourquoi','quand','meme','aide',
  'aidez','idée','idées','application','applications','projet','projets',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // strip accents
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !FR_STOPWORDS.has(t))
}

function ideaToDoc(idea: Idea): string {
  return [
    idea.title, idea.title,           // double title weight
    idea.description,
    idea.problem,
    idea.market,
    idea.revenue,
    idea.stack,
    idea.theme,
    idea.keyword,
    idea.why_now,
    idea.mvp_plan,
  ].filter(Boolean).join(' ')
}

export interface TFIDFIndex {
  score(query: string, ideaId: string): number
  rank(query: string, ideas: Idea[], topN?: number): Idea[]
}

export function buildIndex(ideas: Idea[]): TFIDFIndex {
  const N = ideas.length
  if (N === 0) {
    return {
      score: () => 0,
      rank: (_q, ideas) => ideas,
    }
  }

  // Build per-doc term-frequency maps and doc-frequency map
  const tfMap = new Map<string, Map<string, number>>()    // ideaId → (term → tf)
  const df    = new Map<string, number>()                  // term → #docs containing it

  for (const idea of ideas) {
    const tokens = tokenize(ideaToDoc(idea))
    const freqs = new Map<string, number>()
    for (const t of tokens) {
      freqs.set(t, (freqs.get(t) ?? 0) + 1)
    }
    const maxFreq = Math.max(...freqs.values(), 1)
    // Normalize TF (0.5 + 0.5 * f/maxFreq — augmented frequency)
    const normalized = new Map<string, number>()
    freqs.forEach((f, t) => {
      normalized.set(t, 0.5 + 0.5 * (f / maxFreq))
    })
    tfMap.set(idea.id, normalized)
    freqs.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1))
  }

  function idf(term: string): number {
    const d = df.get(term) ?? 0
    return d === 0 ? 0 : Math.log((N + 1) / (d + 1)) + 1  // smoothed IDF
  }

  function score(query: string, ideaId: string): number {
    const qTokens = tokenize(query)
    if (qTokens.length === 0) return 0
    const docTF = tfMap.get(ideaId)
    if (!docTF) return 0

    let dot = 0, qNorm = 0, dNorm = 0
    const uniqueTerms = new Set([...qTokens, ...docTF.keys()])

    uniqueTerms.forEach(t => {
      const qTFIDF = (qTokens.filter(x => x === t).length > 0 ? 1 : 0) * idf(t)
      const dTFIDF = (docTF.get(t) ?? 0) * idf(t)
      dot   += qTFIDF * dTFIDF
      qNorm += qTFIDF * qTFIDF
      dNorm += dTFIDF * dTFIDF
    })

    if (qNorm === 0 || dNorm === 0) return 0
    return dot / (Math.sqrt(qNorm) * Math.sqrt(dNorm))   // cosine similarity
  }

  function rank(query: string, ideas: Idea[], topN = 5): Idea[] {
    const scored = ideas.map(i => ({ idea: i, s: score(query, i.id) }))
    scored.sort((a, b) => b.s - a.s)
    return scored.filter(x => x.s > 0).slice(0, topN).map(x => x.idea)
  }

  return { score, rank }
}
