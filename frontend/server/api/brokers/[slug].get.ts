import type { Broker } from '../../../types/broker'
import { BROKERS_BY_SLUG } from '~/data/brokers'
import { prisma } from '../../utils/prisma'
import { dbBrokerToPublic } from '../../utils/broker-mapper'

export default defineEventHandler(async (event): Promise<Broker | null> => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null

  try {
    const row = await prisma.broker.findFirst({ where: { slug, status: 'PUBLISHED' } })
    if (row) return dbBrokerToPublic(row)
  } catch (err) {
    console.warn('[brokers/detail] database unavailable, serving mock', err)
  }

  return BROKERS_BY_SLUG[slug] ?? mockTopBrokers.find(b => b.slug === slug) ?? null
})

