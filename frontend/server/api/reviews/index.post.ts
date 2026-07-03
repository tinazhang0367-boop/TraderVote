import { createError, readBody } from 'h3'
import type { RatingBreakdown } from '~/types/broker'
import { bandFromScore } from '~/utils/trust-score'
import { getCurrentUser } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    brokerId?: number
    authorName?: string
    authorEmail?: string
    authorCountry?: string
    experienceLevel?: string
    tradedAssets?: string[]
    ratingBreakdown?: RatingBreakdown
    title?: string
    body?: string
    website?: string
  }>(event) || {}

  if (body.website) {
    return { ok: true, status: 'PENDING' }
  }

  const brokerId = Number(body.brokerId)
  const reviewBody = String(body.body || '').trim()
  const email = String(body.authorEmail || '').trim().toLowerCase()
  const ratings = body.ratingBreakdown

  if (!brokerId || !ratings || reviewBody.length < 50 || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Missing review fields' })
  }

  const broker = await prisma.broker.findUnique({ where: { id: brokerId } })
  if (!broker) {
    throw createError({ statusCode: 404, statusMessage: 'Broker not found' })
  }

  const score = Number(((ratings.withdrawal + ratings.platform + ratings.support + ratings.pricing) / 4).toFixed(1))
  const user = await getCurrentUser(event)
  const authorName = user?.name || String(body.authorName || email.split('@')[0] || 'Trader').trim()

  const review = await prisma.review.create({
    data: {
      brokerId: broker.id,
      userId: user?.id,
      brokerSlug: broker.slug,
      authorName,
      authorEmail: email,
      authorCountry: String(body.authorCountry || 'Unknown'),
      authorCountryCode: String(body.authorCountry || ''),
      rating: score,
      trustBand: bandFromScore(score),
      title: String(body.title || '').trim() || null,
      body: reviewBody,
      ratingJson: JSON.stringify(ratings),
      experienceLevel: String(body.experienceLevel || ''),
      tradedAssets: JSON.stringify(body.tradedAssets || []),
      status: 'PENDING',
      source: 'USER',
    },
  })

  return { ok: true, id: review.id, status: review.status }
})
