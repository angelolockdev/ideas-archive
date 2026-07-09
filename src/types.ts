/// <reference types="vite/client" />

export interface Idea {
  id: string
  title: string
  description: string
  problem: string
  market: string
  revenue: string
  stack: string
  difficulty: number | null
  source: 'idees-matin' | 'self-improving' | 'scan-niches' | 'freelance' | 'trading'
  region: 'global' | 'madagascar'
  theme?: string
  keyword?: string
  why_now?: string
  mvp_plan?: string
  action_plan?: string
  competition?: string
  market_size?: string
  company?: string
  location?: string
  employment_type?: string
  link?: string
  salary?: string
  posted_date?: string
  fit_score?: number
  date: string
  status: 'pending' | 'starred'
  category: Category
}

export type Category = 'productivity' | 'ai' | 'fintech' | 'health' | 'transport' | 'climate' | 'social' | 'edtech' | 'devtools' | 'iot' | 'business-niche' | 'job' | 'trading-strategy' | 'other'

export interface MonthlyData {
  month: string
  updated_at: string
  ideas: Idea[]
}

export interface Collection {
  id: string
  name: string
  ideaIds: string[]
  createdAt: number
}

export type ViewMode = 'grid' | 'list'

export const SOURCE_LABELS: Record<Idea['source'], string> = {
  'idees-matin': 'Idées du matin',
  'self-improving': 'Self-Improving',
  'scan-niches': 'Niches Business',
  'freelance': 'Emplois Tech',
  'trading': 'Stratégies Trading',
}

export const REGION_LABELS: Record<Idea['region'], string> = {
  global: 'Global',
  madagascar: 'Madagascar',
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Très facile',
  2: 'Facile',
  3: 'Moyen',
  4: 'Difficile',
  5: 'Très difficile',
}

export const CATEGORIES: Record<Category, string> = {
  productivity: 'Productivité',
  ai: 'IA / ML',
  fintech: 'Fintech',
  health: 'Santé',
  transport: 'Transport',
  climate: 'Climat',
  social: 'Social',
  edtech: 'Éducation',
  devtools: 'DevTools',
  iot: 'IoT',
  'business-niche': 'Niches Business',
  'job': 'Emplois Tech',
  'trading-strategy': 'Trading',
  other: 'Autre',
}

export const CAT_COLORS: Record<Category, string> = {
  productivity: '#34d399',
  ai: '#a78bfa',
  fintech: '#f59e0b',
  health: '#2dd4bf',
  transport: '#60a5fa',
  climate: '#34d399',
  social: '#ef4444',
  edtech: '#f59e0b',
  devtools: '#a78bfa',
  iot: '#2dd4bf',
  'business-niche': '#f97316',
  'job': '#3b82f6',
  'trading-strategy': '#8b5cf6',
  other: '#9ca3af',
}

export const CAT_ICONS: Record<Category, string> = {
  productivity: '⚡',
  ai: '🤖',
  fintech: '💰',
  health: '❤️',
  transport: '🚚',
  climate: '🌍',
  social: '👥',
  edtech: '🎓',
  devtools: '🔧',
  iot: '🏡',
  'business-niche': '📊',
  'job': '💼',
  'trading-strategy': '📈',
  other: '💡',
}

export const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export const COMPETITION_LABELS: Record<string, string> = {
  'Très faible': '🟢 Très faible',
  'Faible': '🟢 Faible',
  'Moyenne': '🟡 Moyenne',
  'Élevée': '🔴 Élevée',
  'Tres faible': '🟢 Très faible',
  'Très élevée': '🔴 Très élevée',
}

export const COMPETITION_COLORS: Record<string, string> = {
  'Très faible': '#34d399',
  'Faible': '#4ade80',
  'Moyenne': '#facc15',
  'Élevée': '#ef4444',
  'Tres faible': '#34d399',
  'Très élevée': '#dc2626',
}

export const JOB_TYPE_COLORS: Record<string, string> = {
  'Freelance': '#f97316',
  'CDI': '#3b82f6',
  'Remote': '#34d399',
  'Stage': '#8b5cf6',
}

export type PageTab = 'ideas' | 'niches' | 'jobs' | 'trading'
