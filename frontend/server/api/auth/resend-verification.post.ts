import { createError } from 'h3'
import { requireUser } from '../../utils/auth'
import { createEmailVerificationToken } from '../../utils/email-verification'
import { sendVerificationEmail } from '../../utils/mail'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  if (user.emailVerifiedAt) {
    return { ok: true, alreadyVerified: true }
  }

  const token = await createEmailVerificationToken(user.id, user.email)
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com').replace(/\/$/, '')
  const verifyUrl = `${siteUrl}/verify-email?token=${token}`

  try {
    await sendVerificationEmail({ to: user.email, name: user.name, verifyUrl })
  } catch (err: any) {
    throw createError({ statusCode: 502, statusMessage: err?.message || 'Failed to send verification email' })
  }

  return { ok: true }
})

