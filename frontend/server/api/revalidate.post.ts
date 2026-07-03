// Webhook: AI workers trigger Nuxt ISR refresh after content update
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = getHeader(event, 'x-revalidate-secret')
  if (secret !== config.revalidateSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const body = await readBody<{ paths: string[] }>(event)
  // Nitro: useStorage('cache:routes') for ISR invalidation
  for (const path of body?.paths || []) {
    await useStorage('cache').removeItem(`routes:${path}`)
  }
  return { ok: true, paths: body?.paths || [] }
})
