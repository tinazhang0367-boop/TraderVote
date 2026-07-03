import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com').replace(/\/$/, '')
  const staticPaths = ['', '/brokers', '/regulators', '/top', '/reviews', '/blog', '/methodology', '/privacy', '/terms']

  let brokerPaths: string[] = []
  try {
    const brokers = await prisma.broker.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
      take: 1000,
    })
    brokerPaths = brokers.map(b => `/brokers/${b.slug}`)
  } catch {
    brokerPaths = []
  }

  const urls = [...staticPaths, ...brokerPaths]
    .map(path => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})

