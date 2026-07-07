import { useState, useRef, useEffect } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Card } from '@astryxdesign/core/Card'
import type { Idea } from '../types'
import { CATEGORIES } from '../types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AgentChatProps {
  ideas: Idea[]
}

// Smart local Q&A based on ideas data
function findAnswer(question: string, ideas: Idea[]): string {
  const q = question.toLowerCase()

  // Intent: list categories
  if (q.includes('catégorie') || q.includes('categorie') || q.includes('catégories') || q.includes('categories')) {
    const cats = [...new Set(ideas.map(i => i.category))]
    return `📂 **Catégories disponibles** (${cats.length}) :\n\n${cats.map(c => `- ${CATEGORIES[c]} (${ideas.filter(i => i.category === c).length} idées)`).join('\n')}`
  }

  // Intent: best ideas
  if (q.includes('meilleur') || q.includes('coup de cœur') || q.includes('coup de coeur') || q.includes('favori') || q.includes('star')) {
    const starred = ideas.filter(i => i.status === 'starred')
    if (starred.length === 0) return "⭐ Aucune idée n'a encore été marquée comme coup de cœur. Cliquez sur l'étoile ☆ en haut à droite d'une carte pour l'ajouter !"
    return `⭐ **${starred.length} coups de cœur** :\n\n${starred.map(i => `- **${i.title}** (${CATEGORIES[i.category]})`).join('\n')}`
  }

  // Intent: count/stats
  if (q.includes('combien') || q.includes('nombre') || q.includes('total') || q.includes('stat')) {
    const madagascar = ideas.filter(i => i.region === 'madagascar').length
    const global = ideas.filter(i => i.region === 'global').length
    return `📊 **Statistiques** :\n\n- **${ideas.length}** idées au total\n- **${madagascar}** ciblées Madagascar 🇲🇬\n- **${global}** marché global 🌍\n- **${ideas.filter(i => i.status === 'starred').length}** coups de cœur ⭐`
  }

  // Intent: search by keyword in title/description
  const matching = ideas.filter(i => {
    const haystack = `${i.title} ${i.description} ${i.problem} ${i.theme || ''} ${i.stack || ''}`.toLowerCase()
    // Extract potential keywords from question
    const words = q.split(' ').filter(w => w.length > 3 && !['quoi', 'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi', 'est', 'que', 'les', 'des', 'une', 'dans', 'pour', 'avec', 'plus', 'moins', 'peux', 'peut', 'sont', 'dont', 'idée', 'idées', 'aide', 'aide-moi', 'agent', 'assistant', 'peux-tu', 'dis-moi'].includes(w))
    return words.some(w => haystack.includes(w))
  })

  if (matching.length > 0 && matching.length <= 10) {
    return `🔍 **${matching.length} idée${matching.length > 1 ? 's' : ''} trouvée${matching.length > 1 ? 's' : ''}** pour "${question.substring(0, 60)}" :\n\n${matching.slice(0, 5).map(i => `- **${i.title}** (${CATEGORIES[i.category]}, ${i.region === 'madagascar' ? 'Mada' : 'Global'})\n  ${(i.description || i.problem || '').substring(0, 100)}...`).join('\n\n')}${matching.length > 5 ? `\n\n... et ${matching.length - 5} autres. Affinez votre recherche.` : ''}`
  }

  if (matching.length > 10) {
    return `🔍 **${matching.length} idées** correspondent à votre recherche. Essayez d'affiner avec des mots-clés plus spécifiques.`
  }

  // Intent: help
  if (q.includes('aide') || q.includes('help') || q.includes('quoi') || q.includes('que faire') || q.includes('peux-tu') || q.includes('bonjour') || q.includes('salut')) {
    return `👋 **Bonjour !** Je suis l'assistant Ideas Archive. Voici ce que je peux faire :\n\n- 🔍 **Rechercher** des idées par mot-clé (ex: "applications de santé")\n- ⭐ **Lister** les coups de cœur\n- 📊 **Afficher** les statistiques\n- 📂 **Explorer** par catégorie\n- 🇲🇬 **Filtrer** par région (Madagascar / Global)\n\nPosez-moi une question !`
  }

  // Default: suggest filtering
  return `🤔 Je n'ai pas trouvé d'idée correspondant à "${question.substring(0, 80)}".\n\nEssayez :\n- Un autre mot-clé\n- "meilleures idées" pour voir les coups de cœur\n- "statistiques" pour un résumé\n- "catégories" pour explorer\n- "aide" pour voir ce que je peux faire`
}

export function AgentChat({ ideas }: AgentChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Bonjour ! Je suis l\'assistant Ideas Archive. Je peux vous aider à explorer les idées, trouver les meilleures, ou répondre à vos questions. Tapez "aide" pour voir tout ce que je peux faire.' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const answer = findAnswer(trimmed, ideas)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="agent-chat-container">
      {isOpen && (
        <div className="agent-chat-panel" style={{
          background: 'var(--color-background-surface)',
          border: '1px solid var(--color-border)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)' }}>
                Assistant IA
              </span>
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 4,
                background: 'var(--color-accent)', color: '#fff',
              }}>
                Astryx
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-tertiary)', fontSize: 18,
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            padding: '12px 16px',
            height: 300,
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: msg.role === 'user'
                  ? 'var(--color-accent)'
                  : 'var(--color-background-body)',
                color: msg.role === 'user'
                  ? '#fff'
                  : 'var(--color-text-primary)',
                fontSize: 12.5,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                <span dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }} />
              </div>
            ))}
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '8px 16px',
                borderRadius: '12px 12px 12px 4px',
                background: 'var(--color-background-body)',
                fontSize: 12.5,
              }}>
                <span style={{ display: 'inline-flex', gap: 3 }}>
                  <span style={{ animation: 'fadeIn 0.6s infinite', animationDelay: '0s' }}>●</span>
                  <span style={{ animation: 'fadeIn 0.6s infinite', animationDelay: '0.2s' }}>●</span>
                  <span style={{ animation: 'fadeIn 0.6s infinite', animationDelay: '0.4s' }}>●</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-element)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-background-body)',
                color: 'var(--color-text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-element)',
                border: 'none',
                background: input.trim() ? 'var(--color-accent)' : 'var(--color-border)',
                color: input.trim() ? '#fff' : 'var(--color-text-tertiary)',
                cursor: input.trim() ? 'pointer' : 'default',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <div className="agent-chat-toggle">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 52, height: 52,
            borderRadius: '50%',
            border: '2px solid var(--color-border)',
            background: 'var(--color-background-surface)',
            color: 'var(--color-accent)',
            fontSize: 22,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          title="Assistant IA — Aide à explorer les idées"
        >
          <span style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
            {isOpen ? '✕' : '💬'}
          </span>
        </button>
      </div>
    </div>
  )
}
