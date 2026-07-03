import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [brokers, reviewsPending, users, articles, aiQueued] = await Promise.all([
    prisma.broker.count(),
    prisma.review.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.article.count(),
    prisma.aiTask.count({ where: { status: 'QUEUED' } }),
  ])

  return { brokers, reviewsPending, users, articles, aiQueued }
})

