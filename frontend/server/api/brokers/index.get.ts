import type { Broker } from '../../../types/broker'
import { prisma } from '../../utils/prisma'
import { dbBrokerToPublic } from '../../utils/broker-mapper'

export default defineEventHandler(async (event): Promise<Broker[]> => {
  const q = getQuery(event)

  try {
    const query = String(q.q || '').trim()
    const rows = await prisma.broker.findMany({
      where: {
        status: 'PUBLISHED',
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { slug: { contains: query } },
                { regulators: { contains: query.toUpperCase() } },
              ],
            }
          : {}),
      },
      orderBy: [{ rank: 'asc' }, { trustScore: 'desc' }],
    })

    if (rows.length) return rows.map(dbBrokerToPublic)
  } catch (err) {
    console.warn('[brokers] database unavailable, serving mock data', err)
  }

  return mockTopBrokers.filter(b => !q.q || b.name.toLowerCase().includes(String(q.q).toLowerCase()))
})

