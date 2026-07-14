import { MONTHS_FR } from '../types'

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/** Formats date-only archive values without applying a timezone conversion. */
export function formatArchiveDate(value?: string): string {
  if (!value) return 'Date non renseignée'

  const match = ISO_DATE_PATTERN.exec(value.trim())
  if (!match) return value

  const [, year, month, day] = match
  const monthIndex = Number(month) - 1
  const dayNumber = Number(day)

  if (monthIndex < 0 || monthIndex >= MONTHS_FR.length || dayNumber < 1 || dayNumber > 31) {
    return value
  }

  const parsed = new Date(Date.UTC(Number(year), monthIndex, dayNumber))
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== monthIndex ||
    parsed.getUTCDate() !== dayNumber
  ) {
    return value
  }

  return `${dayNumber} ${MONTHS_FR[monthIndex]} ${year}`
}

export function formatArchiveMonth(value: string): string {
  const [year, month] = value.split('-')
  const monthIndex = Number(month) - 1
  return monthIndex >= 0 && monthIndex < MONTHS_FR.length ? `${MONTHS_FR[monthIndex]} ${year}` : value
}
