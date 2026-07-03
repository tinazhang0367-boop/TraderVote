import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 100,
  })
})

