import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return prisma.review.findMany({
    include: { broker: { select: { name: true, slug: true } }, user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
})

