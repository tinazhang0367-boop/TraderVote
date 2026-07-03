import { createError, readBody } from 'h3'
import { createUserSession, verifyPassword } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event) || {}
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await createUserSession(event, user.id)

  return { id: user.id, name: user.name, email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt }
})
