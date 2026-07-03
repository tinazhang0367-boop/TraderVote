import { readBody } from 'h3'
import { sendPasswordResetEmail } from '../../utils/mail'
import { createPasswordResetToken } from '../../utils/password-reset'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event) || {}
  const email = String(body.email || '').trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return { ok: true }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.status !== 'ACTIVE') {
    return { ok: true }
  }

  const token = await createPasswordResetToken(user.id, user.email)
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com').replace(/\/$/, '')
  const resetUrl = `${siteUrl}/reset-password?token=${token}`

  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    })
  } catch (err) {
    console.error('[auth/forgot-password] reset email failed', err)
  }

  return { ok: true }
})
