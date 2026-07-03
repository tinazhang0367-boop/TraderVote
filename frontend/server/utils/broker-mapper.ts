import type { Broker, TrustBand } from '~/types/broker'

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function dbBrokerToPublic(row: any): Broker {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logoUrl ?? '',
    regulators: parseJson<string[]>(row.regulators, []),
    founded: row.founded ?? 0,
    headquarters: row.headquarters ?? '',
    minDeposit: parseJson(row.minDepositJson, null),
    maxLeverage: row.maxLeverage ?? '',
    spreadsFrom: row.spreadsFrom ?? 0,
    platforms: parseJson<string[]>(row.platforms, []),
    trustScore: row.trustScore ?? 0,
    trustBand: (row.trustBand ?? 'average') as TrustBand,
    reviewCount: row.reviewCount ?? 0,
    rank: row.rank ?? undefined,
    category: row.category ?? 'forex',
    affiliateUrl: row.affiliateUrl ?? undefined,
    description: row.description ?? undefined,
    aiSummary: row.aiSummary ?? undefined,
    aiSummaryAt: row.aiSummaryAt?.toISOString?.(),
  }
}

