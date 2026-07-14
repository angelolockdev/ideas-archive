import { Fragment, useState, useRef, useEffect, useMemo } from 'react'
import type { Idea } from '../types'
import { CATEGORIES } from '../types'
import { buildIndex } from '../lib/tfidf'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AgentChatProps {
  ideas: Idea[]
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return lines.map((line, lineIndex) => (
    <Fragment key={`${lineIndex}-${line}`}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
          : <Fragment key={partIndex}>{part}</Fragment>,
      )}
      {lineIndex < lines.length - 1 && <br />}
    </Fragment>
  ))
}

function findAnswer(question: string, ideas: Idea[], index: ReturnType<typeof buildIndex>): string {
  const q = question.toLowerCase().trim()

  // Intent: categories
  if (/catégori|categori/.test(q)) {
    const categoryCounts = new Map<Idea['category'], number>()
    ideas.forEach(idea => {
      categoryCounts.set(idea.category, (categoryCounts.get(idea.category) ?? 0) + 1)
    })
    const lines = [...categoryCounts]
      .map(([category, count]) => `  ${CATEGORIES[category]} — ${count} idées`)
      .join('\n')
    return `**Catégories (${categoryCounts.size})**\n\n${lines}`
  }

  // Intent: starred
  if (/meilleur|coup de |favori|star|◆|♦/.test(q)) {
    const starred = ideas.filter(i => i.status === 'starred')
    if (starred.length === 0) return 'Aucune idée marquée pour l\'instant. Cliquez sur ◇ dans une carte pour ajouter un coup de cœur.'
    return `**${starred.length} coup${starred.length > 1 ? 's' : ''} de cœur**\n\n${starred.map(i => `  ${CATEGORIES[i.category]} — **${i.title}**`).join('\n')}`
  }

  // Intent: stats
  if (/combien|nombre|total|stat/.test(q)) {
    const mada = ideas.filter(i => i.region === 'madagascar').length
    const glob = ideas.filter(i => i.region === 'global').length
    const cats = [...new Set(ideas.map(i => i.category))].length
    return `**Archive — ${ideas.length} spécimens**\n\n  Madagascar 🇲🇬 — ${mada}\n  Global 🌍 — ${glob}\n  Catégories — ${cats}\n  Coups de cœur — ${ideas.filter(i => i.status === 'starred').length}`
  }

  // Intent: help / greeting
  if (/aide|help|bonjour|salut|quoi|que faire|peux.tu/.test(q)) {
    return '**Que puis-je faire ?**\n\n  Recherche sémantique — "idées de transport à Madagascar"\n  Stats — "combien d\'idées ?"\n  Coups de cœur — "meilleures idées"\n  Catégories — "quelles catégories ?"\n\nJe classe les résultats par pertinence (TF-IDF).'
  }

  // TF-IDF semantic search
  const results = index.rank(question, ideas, 6)
  if (results.length > 0) {
    const lines = results
      .map(i => `  **${i.title}**\n  ${CATEGORIES[i.category]} · ${i.region === 'madagascar' ? '🇲🇬' : '🌍'} · ${(i.description || i.problem || '').slice(0, 90)}…`)
      .join('\n\n')
    return `**${results.length} résultat${results.length > 1 ? 's' : ''} pour "${question.slice(0, 50)}"**\n\n${lines}`
  }

  return `Aucun résultat pour "${question.slice(0, 60)}".\n\nEssayez un autre mot-clé, ou tapez "aide" pour voir ce que je peux faire.`
}

export function AgentChat({ ideas }: AgentChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Je peux rechercher dans l\'archive par sémantique, lister les catégories ou les coups de cœur. Essayez "idées de logistique" ou "aide".' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Build TF-IDF index once ideas load (memoized)
  const tfidfIndex = useMemo(() => buildIndex(ideas), [ideas])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const answer = findAnswer(trimmed, ideas, tfidfIndex)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
      setIsTyping(false)
    }, 400 + Math.random() * 300)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="agent-chat-container">
      {isOpen && (
        <div
          className="agent-chat-panel"
          role="log"
          aria-label="Assistant IA"
          aria-live="polite"
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--ochre)',
              }}>◎</span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: 13.5,
                color: 'var(--color-text-primary)',
              }}>Assistant</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9.5,
                padding: '1px 6px', borderRadius: 'var(--radius-full)',
                background: 'var(--ochre-tint)',
                color: 'var(--ochre)',
                border: '1px solid var(--ochre-line)',
              }}>TF-IDF</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer l'assistant"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-tertiary)', fontSize: 16, padding: '2px 6px',
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            padding: '12px 14px',
            height: 320, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div
                  className="chat-bubble"
                  style={{
                    borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: msg.role === 'user'
                      ? 'var(--color-text-primary)'
                      : 'var(--color-background-body)',
                    color: msg.role === 'user'
                      ? 'var(--color-background-body)'
                      : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 3, padding: '8px 12px' }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--color-text-tertiary)',
                    display: 'inline-block',
                    animation: `typing-dot 1s ease ${delay}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Recherche sémantique…"
              aria-label="Message à l'assistant"
              className="ledger-search"
              style={{ flex: 1, fontSize: 13 }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Envoyer"
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-element)',
                border: 'none',
                background: input.trim() ? 'var(--color-text-primary)' : 'var(--color-border)',
                color: input.trim() ? 'var(--color-background-surface)' : 'var(--color-text-tertiary)',
                cursor: input.trim() ? 'pointer' : 'default',
                fontFamily: 'var(--font-mono)', fontSize: 12,
                transition: 'background 0.18s',
              }}
            >→</button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <div className="agent-chat-toggle">
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Fermer l\'assistant' : 'Ouvrir l\'assistant IA'}
          aria-expanded={isOpen}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-background-surface)',
            color: isOpen ? 'var(--ochre)' : 'var(--color-text-secondary)',
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-med)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s, border-color 0.2s',
            borderColor: isOpen ? 'var(--ochre-line)' : undefined,
          }}
        >
          {isOpen ? '✕' : '◎'}
        </button>
      </div>
    </div>
  )
}
