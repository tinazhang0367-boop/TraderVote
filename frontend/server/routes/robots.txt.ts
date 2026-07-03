export default defineEventHandler((event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com'

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  ].join('\n')
})
