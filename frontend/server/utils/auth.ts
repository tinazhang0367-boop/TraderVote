import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { createError, deleteCookie, getCookie, setCookie } from 'h3'
import { prisma } from './prisma'

const COOKIE_NAME = 'tv_session'
const SESSION_DAYS = 30

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const original = Buffer.from(hash, 'hex')
  return original.length === candidate.length && timingSafeEqual(original, candidate)
}

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createUserSession(event: H3Event, userId: number) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000)

  await prisma.session.create({
    data: { userId, tokenHash: tokenHash(token), expiresAt },
  })

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function getCurrentUser(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date() || session.user.status !== 'ACTIVE') {
    return null
  }

  return session.user
}

export async function requireUser(event: H3Event) {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Login required' })
  }
  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireUser(event)
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin required' })
  }
  return user
}

export async function clearUserSession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME)
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: tokenHash(token) } })
  }
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

