import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return prisma.aiTask.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
})

