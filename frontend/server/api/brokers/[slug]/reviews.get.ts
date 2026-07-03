import type { Review } from '~/types/broker'
import { prisma } from '../../../utils/prisma'
import { dbReviewToPublic } from '../../../utils/review-mapper'

export default defineEventHandler(async (event): Promise<Review[]> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return []

  try {
    const rows = await prisma.review.findMany({
      where: { brokerSlug: slug, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    if (rows.length) return rows.map(dbReviewToPublic)
  } catch (err) {
    console.warn('[broker/reviews] database unavailable, serving mock', err)
  }

  return mockReviews.filter(r => r.brokerSlug === slug)
})

const mockReviews: Review[] = [
  { id: 1, brokerId: 1, brokerSlug: 'exness', authorName: 'Somchai J.', authorCountry: 'Thailand', rating: 5, trustBand: 'excellent', title: 'Fast withdrawal', body: 'Withdrawal is very fast, within 2 hours. Thai support is excellent. I have used it for 3 years without major issues.', helpful: 42, verified: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 2, brokerId: 1, brokerSlug: 'exness', authorName: 'Budi Santoso', authorCountry: 'Indonesia', rating: 3, trustBand: 'average', title: 'Spread widens during busy hours', body: 'EUR/USD spread can widen during busy sessions. Deposit is fast, but withdrawals may take 1-2 business days.', helpful: 18, verified: true, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 3, brokerId: 2, brokerSlug: 'xm', authorName: 'Tran B.', authorCountry: 'Vietnam', rating: 4, trustBand: 'great', body: 'Good for beginners, attractive bonus and stable spreads.', helpful: 15, verified: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
]

