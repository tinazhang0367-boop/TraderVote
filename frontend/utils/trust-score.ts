import type { TrustBand } from '~/types/broker'

export const TRUST_BAND_LABEL: Record<TrustBand, string> = {
  excellent: 'Excellent',
  great: 'Great',
  average: 'Average',
  poor: 'Poor',
  bad: 'Bad',
}

export const TRUST_BAND_COLOR: Record<TrustBand, string> = {
  excellent: 'var(--score-excellent)',
  great: 'var(--score-great)',
  average: 'var(--score-average)',
  poor: 'var(--score-poor)',
  bad: 'var(--score-bad)',
}

export const TRUST_BAND_BG: Record<TrustBand, string> = {
  excellent: 'var(--score-excellent-bg)',
  great: 'var(--score-great-bg)',
  average: 'var(--score-average-bg)',
  poor: 'var(--score-poor-bg)',
  bad: 'var(--score-bad-bg)',
}

export const TRUST_BAND_RANGE: Record<TrustBand, [number, number]> = {
  excellent: [4.5, 5.0],
  great: [4.0, 4.49],
  average: [3.0, 3.99],
  poor: [2.0, 2.99],
  bad: [0, 1.99],
}

export function bandFromScore(score: number): TrustBand {
  if (score >= 4.5) return 'excellent'
  if (score >= 4.0) return 'great'
  if (score >= 3.0) return 'average'
  if (score >= 2.0) return 'poor'
  return 'bad'
}

export function starsFor(score: number): string {
  const full = Math.floor(score)
  const half = score - full >= 0.5
  return '\u2605'.repeat(full) + (half ? '\u00BD' : '') + '\u2606'.repeat(5 - full - (half ? 1 : 0))
}
