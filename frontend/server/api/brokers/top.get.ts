import type { Broker } from '~/types/broker'
import { prisma } from '../../utils/prisma'
import { dbBrokerToPublic } from '../../utils/broker-mapper'

export default defineEventHandler(async (): Promise<Broker[]> => {
  try {
    const rows = await prisma.broker.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ rank: 'asc' }, { trustScore: 'desc' }],
      take: 10,
    })
    if (rows.length) return rows.map(dbBrokerToPublic)
  } catch (err) {
    console.warn('[brokers/top] database unavailable, serving mock', err)
  }

  return mockTopBrokers
})

