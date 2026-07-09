import type { Idea } from '../types'
import { JobCard } from './JobCard'

interface JobGridProps {
  jobs: Idea[]
  toggleStar: (id: string) => void
  formatDate: (d: string) => string
  onOpenDetail: (idea: Idea) => void
  isFiltered: boolean
  loading: boolean
}

export function JobGrid({ jobs, toggleStar, formatDate, onOpenDetail, isFiltered, loading }: JobGridProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <span>Chargement des offres…</span>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">💼</span>
        <h3>{isFiltered ? 'Aucune offre trouvée' : 'Aucune offre pour le moment'}</h3>
        <p>{isFiltered
          ? 'Essaie de modifier ou réinitialiser les filtres.'
          : 'Les offres freelance apparaîtront ici après chaque scan quotidien.'}
        </p>
      </div>
    )
  }

  return (
    <div className="job-grid">
      {jobs.map((job, i) => (
        <JobCard
          key={job.id}
          idea={job}
          index={i}
          toggleStar={toggleStar}
          formatDate={formatDate}
          onOpen={onOpenDetail}
        />
      ))}
    </div>
  )
}
