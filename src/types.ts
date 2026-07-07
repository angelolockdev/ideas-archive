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
  source: 'idees-matin' | 'self-improving'
  region: 'global' | 'madagascar'
  theme?: string
  keyword?: string
  why_now?: string
  mvp_plan?: string
  date: string
  status: 'pending' | 'starred'
  category: Category
}

export type Category = 'productivity' | 'ai' | 'fintech' | 'health' | 'transport' | 'climate' | 'social' | 'edtech' | 'devtools' | 'iot' | 'other'

export interface MonthlyData {
  month: string
  updated_at: string
  ideas: Idea[]
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
  other: '💡',
}

export const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
