import { createError, readBody } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { sendMailTestEmail } from '../../utils/mail'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody<{ to?: string }>(event) || {}
  const to = String(body.to || admin.email).trim()

  if (!to.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid recipient required' })
  }

  try {
    await sendMailTestEmail({
      to,
      name: admin.name,
    })
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err?.message || 'SMTP test failed' })
  }

  return { ok: true, to }
})
