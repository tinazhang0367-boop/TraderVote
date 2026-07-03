import { createHash, randomBytes } from 'node:crypto'
import { prisma } from './prisma'

export function hashEmailToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createEmailVerificationToken(userId: number, email: string) {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashEmailToken(token)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.emailVerificationToken.create({
    data: { userId, email, tokenHash, expiresAt },
  })

  return token
}

