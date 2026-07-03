import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return prisma.broker.findMany({
    orderBy: [{ rank: 'asc' }, { updatedAt: 'desc' }],
    take: 100,
  })
})

