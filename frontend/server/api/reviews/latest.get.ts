import type { Review } from '~/types/broker'
import { prisma } from '../../utils/prisma'
import { dbReviewToPublic } from '../../utils/review-mapper'

export default defineEventHandler(async (): Promise<Review[]> => {
  try {
    const rows = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 12,
    })
    if (rows.length) return rows.map(dbReviewToPublic)
  } catch (err) {
    console.warn('[reviews/latest] database unavailable, serving mock', err)
  }

  return mockLatest
})

const mockLatest: Review[] = [
  { id: 101, brokerId: 1, brokerSlug: 'exness', authorName: 'Somchai J.', authorCountry: 'Thailand', rating: 5, trustBand: 'excellent', body: 'Very fast withdrawal within 2 hours. Excellent Thai support.', helpful: 42, verified: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 102, brokerId: 2, brokerSlug: 'xm', authorName: 'Nguyen V.', authorCountry: 'Vietnam', rating: 4, trustBand: 'great', body: 'Low spreads, fast withdrawal. Vietnamese support is helpful.', helpful: 28, verified: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 103, brokerId: 3, brokerSlug: 'fxgt', authorName: 'Budi S.', authorCountry: 'Indonesia', rating: 4, trustBand: 'great', body: 'Complete crypto pairs and fast local deposit.', helpful: 19, verified: true, createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
]

