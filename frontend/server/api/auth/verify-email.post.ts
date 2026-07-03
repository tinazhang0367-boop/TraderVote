import { createError, readBody } from 'h3'
import { hashEmailToken } from '../../utils/email-verification'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string }>(event) || {}
  const token = String(body.token || '').trim()

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Verification token required' })
  }

  const row = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashEmailToken(token) },
    include: { user: true },
  })

  if (!row || row.usedAt || row.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Verification link is invalid or expired' })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { ok: true, email: row.email }
})

