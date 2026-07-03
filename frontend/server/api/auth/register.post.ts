import { createError, readBody } from 'h3'
import { createUserSession, hashPassword } from '../../utils/auth'
import { createEmailVerificationToken } from '../../utils/email-verification'
import { sendVerificationEmail } from '../../utils/mail'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; password?: string }>(event) || {}
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!name || !email || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Name, valid email and 8+ character password are required' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const userCount = await prisma.user.count()
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: userCount === 0 ? 'ADMIN' : 'USER',
    },
  })

  await createUserSession(event, user.id)
  const verifyToken = await createEmailVerificationToken(user.id, user.email)
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://tradervote.com').replace(/\/$/, '')
  const verifyUrl = `${siteUrl}/verify-email?token=${verifyToken}`

  let verificationEmailSent = true
  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verifyUrl,
    })
  } catch (err) {
    verificationEmailSent = false
    console.error('[auth/register] verification email failed', err)
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    verificationEmailSent,
  }
})
