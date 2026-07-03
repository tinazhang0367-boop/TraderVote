import type { Review, TrustBand } from '~/types/broker'

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function dbReviewToPublic(row: any): Review {
  return {
    id: row.id,
    brokerId: row.brokerId,
    brokerSlug: row.brokerSlug,
    authorName: row.authorName,
    authorCountry: row.authorCountry,
    authorCountryCode: row.authorCountryCode ?? undefined,
    rating: row.rating,
    ratingBreakdown: parseJson(row.ratingJson, undefined),
    trustBand: (row.trustBand ?? 'average') as TrustBand,
    title: row.title ?? undefined,
    body: row.body,
    experienceLevel: row.experienceLevel ?? undefined,
    tradedAssets: parseJson(row.tradedAssets, []),
    verified: row.verified,
    helpful: row.helpful,
    createdAt: row.createdAt.toISOString(),
  }
}

