import { useRef, useCallback } from 'react'
import { Star, ExternalLink } from 'lucide-react'
import type { Idea } from '../types'
import { CATEGORIES, CAT_COLORS, CAT_ICONS, JOB_TYPE_COLORS } from '../types'

interface JobCardProps {
  idea: Idea
  index: number
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpen: (idea: Idea) => void
}

const MAX_VISIBLE_SKILLS = 4

export function JobCard({ idea, index, toggleStar, formatDate, onOpen }: JobCardProps) {
  const starred = idea.status === 'starred'
  const cardRef = useRef<HTMLDivElement>(null)
  const typeColor = idea.employment_type ? (JOB_TYPE_COLORS[idea.employment_type] || '#3b82f6') : '#3b82f6'

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
  }, [])

  const skills = (idea.stack || '').split(',').map(s => s.trim()).filter(Boolean)
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS)
  const extraSkills = skills.length - MAX_VISIBLE_SKILLS

  return (
    <div
      ref={cardRef}
      className="job-card rise"
      style={{ animationDelay: `${(index % 8) * 30}ms` }}
      onMouseMove={handleMouseMove}
    >
      <div className="job-card-inner" onClick={() => onOpen(idea)}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          {/* Type badge */}
          {idea.employment_type && (
            <div
              style={{
                flexShrink: 0,
                background: `${typeColor}14`,
                border: `1px solid ${typeColor}30`,
                borderRadius: 'var(--radius-inner)',
                padding: '5px 9px',
                textAlign: 'center',
                minWidth: 68,
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: typeColor, fontWeight: 600 }}>
                {idea.employment_type}
              </div>
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Company + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 11, lineHeight: 1.5, flexShrink: 0 }}>{CAT_ICONS['job']}</span>
              <span className="job-card-company">{idea.company || ''}</span>
              {idea.fit_score != null && (
                <span className="job-fit-score" title="Score de matching">
                  {idea.fit_score}%
                </span>
              )}
            </div>
            <h3 className="job-card-title">{idea.title}</h3>
          </div>

          {/* Star button */}
          <button
            onClick={e => { e.stopPropagation(); toggleStar(idea.id) }}
            aria-label={starred ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur'}
            className={`star-btn ${starred ? 'starred' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <Star size={14} fill={starred ? 'var(--ochre)' : 'none'} />
          </button>
        </div>

        {/* Details row */}
        <div className="job-details">
          {idea.location && (
            <div className="job-detail-item">
              <span className="job-detail-icon">📍</span>
              <span>{idea.location}</span>
            </div>
          )}
          {idea.salary && (
            <div className="job-detail-item">
              <span className="job-detail-icon">💰</span>
              <span style={{ color: 'var(--ochre)', fontWeight: 600 }}>{idea.salary}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="job-card-desc">{idea.description}</p>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="job-skills">
            {visibleSkills.map(skill => (
              <span key={skill} className="job-skill-tag">{skill}</span>
            ))}
            {extraSkills > 0 && (
              <span className="job-skill-tag job-skill-more">+{extraSkills}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="job-footer">
          <span className="job-date">{formatDate(idea.date)}</span>
          {idea.link && (
            <span
              className="job-link-hint"
              onClick={e => { e.stopPropagation(); window.open(idea.link, '_blank') }}
            >
              <ExternalLink size={11} />
              Postuler
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
