import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ status?: string }>(event) || {}
  const status = String(body.status || '').toUpperCase()

  if (!id || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid review status' })
  }

  const review = await prisma.review.update({ where: { id }, data: { status } })

  if (status === 'APPROVED') {
    const approved = await prisma.review.findMany({
      where: { brokerId: review.brokerId, status: 'APPROVED' },
      select: { rating: true },
    })
    const avg = approved.length
      ? Number((approved.reduce((sum, item) => sum + item.rating, 0) / approved.length).toFixed(1))
      : review.rating
    await prisma.broker.update({
      where: { id: review.brokerId },
      data: { trustScore: avg, reviewCount: approved.length },
    })
  }

  return { ok: true, review }
})
