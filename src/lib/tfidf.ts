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
  'mais','ou','donc','or','ni','car','très','tout','tous','toute','toutes',
  'bien','leur','leurs','même','aussi','moins','puis','été','être','avoir',
  'fait','faire','peut','peuvent','pouvoir','sont','ont','comme','entre',
  'sans','sous','vers','selon','lors','après','avant','chez','depuis',
  'pendant','autre','autres','quel','quelle','quels','quelles','non','oui',
  'votre','notre','vos','nos','ainsi','alors','comment','pourquoi','quand',
  'meme','aide','aidez','idée','idées','application','applications','projet',
  'projets',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length >= 3 && !FR_STOPWORDS.has(term))
}

function ideaToDocument(idea: Idea): string {
  return [
    idea.title,
    idea.title,
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

interface DocumentVector {
  weights: Map<string, number>
  norm: number
}

export function buildIndex(ideas: Idea[]): TFIDFIndex {
  if (ideas.length === 0) {
    return {
      score: () => 0,
      rank: (_query, candidates) => candidates,
    }
  }

  const termFrequencies = new Map<string, Map<string, number>>()
  const documentFrequencies = new Map<string, number>()

  for (const idea of ideas) {
    const frequencies = new Map<string, number>()
    for (const term of tokenize(ideaToDocument(idea))) {
      frequencies.set(term, (frequencies.get(term) ?? 0) + 1)
    }

    const maxFrequency = Math.max(...frequencies.values(), 1)
    const normalizedFrequencies = new Map<string, number>()
    frequencies.forEach((frequency, term) => {
      normalizedFrequencies.set(term, 0.5 + 0.5 * (frequency / maxFrequency))
      documentFrequencies.set(term, (documentFrequencies.get(term) ?? 0) + 1)
    })
    termFrequencies.set(idea.id, normalizedFrequencies)
  }

  const inverseDocumentFrequencies = new Map<string, number>()
  documentFrequencies.forEach((frequency, term) => {
    inverseDocumentFrequencies.set(
      term,
      Math.log((ideas.length + 1) / (frequency + 1)) + 1,
    )
  })

  const documentVectors = new Map<string, DocumentVector>()
  termFrequencies.forEach((frequencies, ideaId) => {
    const weights = new Map<string, number>()
    let squaredNorm = 0
    frequencies.forEach((frequency, term) => {
      const weight = frequency * (inverseDocumentFrequencies.get(term) ?? 0)
      weights.set(term, weight)
      squaredNorm += weight * weight
    })
    documentVectors.set(ideaId, { weights, norm: Math.sqrt(squaredNorm) })
  })

  function score(query: string, ideaId: string): number {
    const queryTerms = new Set(tokenize(query))
    const document = documentVectors.get(ideaId)
    if (queryTerms.size === 0 || !document || document.norm === 0) return 0

    let dotProduct = 0
    let squaredQueryNorm = 0
    queryTerms.forEach(term => {
      const queryWeight = inverseDocumentFrequencies.get(term) ?? 0
      dotProduct += queryWeight * (document.weights.get(term) ?? 0)
      squaredQueryNorm += queryWeight * queryWeight
    })

    if (squaredQueryNorm === 0) return 0
    return dotProduct / (Math.sqrt(squaredQueryNorm) * document.norm)
  }

  function rank(query: string, candidates: Idea[], topN = 5): Idea[] {
    return candidates
      .map(idea => ({ idea, score: score(query, idea.id) }))
      .filter(result => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, topN)
      .map(result => result.idea)
  }

  return { score, rank }
}
