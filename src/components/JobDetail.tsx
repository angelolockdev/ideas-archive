import { useEffect, useCallback } from 'react'
import { X, ArrowLeft, ArrowRight, Star, ExternalLink } from 'lucide-react'
import type { Idea } from '../types'
import { CAT_ICONS, JOB_TYPE_COLORS } from '../types'
import { safeExternalHref } from '../lib/url'

interface JobDetailProps {
  job: Idea
  prevJob: Idea | null
  nextJob: Idea | null
  onClose: () => void
  onNavigate: (idea: Idea) => void
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
}

function getLinkLabel(link: string): string {
  try {
    return new URL(link).hostname
  } catch {
    return 'le site de l’offre'
  }
}

export function JobDetail({ job, prevJob, nextJob, onClose, onNavigate, toggleStar, formatDate }: JobDetailProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && prevJob) onNavigate(prevJob)
    if (e.key === 'ArrowRight' && nextJob) onNavigate(nextJob)
  }, [onClose, prevJob, nextJob, onNavigate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const typeColor = job.employment_type ? (JOB_TYPE_COLORS[job.employment_type] || '#3b82f6') : '#3b82f6'
  const applicationUrl = safeExternalHref(job.link)
  const skills = (job.stack || '').split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={job.title}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{CAT_ICONS['job']}</span>
            <span className="eyebrow">Offre Tech</span>
            {job.employment_type && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                color: typeColor, background: `${typeColor}14`,
                border: `1px solid ${typeColor}30`,
                padding: '2px 7px', borderRadius: 4, marginLeft: 4,
              }}>
                {job.employment_type}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => toggleStar(job.id)}
              aria-label={job.status === 'starred' ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="modal-icon-btn"
            >
              <Star size={15} fill={job.status === 'starred' ? 'var(--ochre)' : 'none'} />
            </button>
            <button onClick={onClose} aria-label="Fermer" className="modal-icon-btn">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="detail-scroll">
          {/* Company + Title + Fit score */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              {job.company && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ochre)', fontWeight: 600 }}>
                  {job.company}
                </span>
              )}
              {job.fit_score != null && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                  color: job.fit_score >= 80 ? '#34d399' : job.fit_score >= 60 ? '#facc15' : '#9ca3af',
                  background: job.fit_score >= 80 ? 'rgba(52,211,153,.12)' : job.fit_score >= 60 ? 'rgba(250,204,21,.12)' : 'transparent',
                  border: `1px solid ${job.fit_score >= 80 ? 'rgba(52,211,153,.3)' : job.fit_score >= 60 ? 'rgba(250,204,21,.3)' : 'transparent'}`,
                  padding: '2px 7px', borderRadius: 4,
                }}>
                  Fit {job.fit_score}%
                </span>
              )}
            </div>
            <h2 className="detail-title">{job.title}</h2>
          </div>

          {/* Location + Salary */}
          <div className="job-detail-metrics">
            {job.location && (
              <div className="job-detail-metric">
                <span className="detail-section-title">Localisation</span>
                <span className="job-detail-value">{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="job-detail-metric">
                <span className="detail-section-title">Rémunération</span>
                <span className="job-detail-value" style={{ color: 'var(--ochre)' }}>{job.salary}</span>
              </div>
            )}
            {job.posted_date && (
              <div className="job-detail-metric">
                <span className="detail-section-title">Publié le</span>
                <span className="job-detail-value">{formatDate(job.posted_date)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="detail-section">
            <h4 className="detail-section-title">Description de la mission</h4>
            <p className="detail-text">{job.description}</p>
          </section>

          {/* Problem */}
          {job.problem && (
            <section className="detail-section">
              <h4 className="detail-section-title">Problème / Contexte</h4>
              <p className="detail-text">{job.problem}</p>
            </section>
          )}

          {/* Market */}
          {job.market && (
            <section className="detail-section">
              <h4 className="detail-section-title">Marché / Secteur</h4>
              <p className="detail-text">{job.market}</p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="detail-section">
              <h4 className="detail-section-title">Compétences requises</h4>
              <div className="job-skills" style={{ marginTop: 4 }}>
                {skills.map(skill => (
                  <span key={skill} className="job-skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {/* Apply link */}
          {applicationUrl && (
            <div style={{
              marginTop: 20, padding: '14px 0', borderTop: '1px solid var(--color-border)',
            }}>
              <a
                href={applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="job-apply-btn"
              >
                <ExternalLink size={14} />
                Postuler sur {getLinkLabel(applicationUrl)}
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="detail-footer">
            <span>{formatDate(job.date)}</span>
            <span className="eyebrow">Freelance Tech · {job.id}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="detail-nav" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => prevJob && onNavigate(prevJob)}
            disabled={!prevJob}
            className="detail-nav-btn"
          >
            <ArrowLeft size={14} />
            <span>{prevJob?.title || '—'}</span>
          </button>
          <button
            onClick={() => nextJob && onNavigate(nextJob)}
            disabled={!nextJob}
            className="detail-nav-btn"
            style={{ textAlign: 'right' }}
          >
            <span>{nextJob?.title || '—'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
