import { createHash, randomBytes } from 'node:crypto'
import { prisma } from './prisma'

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createPasswordResetToken(userId: number, email: string) {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashPasswordResetToken(token)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { userId, email, tokenHash, expiresAt },
  })

  return token
}
