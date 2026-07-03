import { createError, readBody } from 'h3'
import { hashPassword } from '../../utils/auth'
import { hashPasswordResetToken } from '../../utils/password-reset'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event) || {}
  const token = String(body.token || '').trim()
  const password = String(body.password || '')

  if (!token || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Valid token and 8+ character password are required' })
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashPasswordResetToken(token) },
    include: { user: true },
  })

  if (!record || record.usedAt || record.expiresAt < new Date() || record.user.status !== 'ACTIVE') {
    throw createError({ statusCode: 400, statusMessage: 'Password reset link is invalid or expired' })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashPassword(password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.deleteMany({
      where: { userId: record.userId },
    }),
  ])

  return { ok: true }
})
