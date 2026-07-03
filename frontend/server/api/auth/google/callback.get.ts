import { createError, getQuery, sendRedirect } from 'h3'
import { createUserSession } from '../../../utils/auth'
import { exchangeGoogleCode, fetchGoogleUserInfo, readOAuthState } from '../../../utils/oauth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = String(query.code || '')
  const returnedState = String(query.state || '')
  const { state, verifier, redirect } = readOAuthState(event)

  if (!code || !state || !verifier || returnedState !== state) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Google login request' })
  }

  const token = await exchangeGoogleCode(event, code, verifier)
  if (!token.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'Google authorization failed' })
  }

  const profile = await fetchGoogleUserInfo(token.access_token)
  const email = String(profile.email || '').trim().toLowerCase()

  if (!profile.sub || !email || !profile.email_verified) {
    throw createError({ statusCode: 401, statusMessage: 'Google account email is not verified' })
  }

  const linkedAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: profile.sub,
      },
    },
    include: { user: true },
  })

  let user = linkedAccount?.user ?? null

  if (!user) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: existing.name || profile.name || email,
          emailVerifiedAt: existing.emailVerifiedAt || new Date(),
          oauthAccounts: {
            create: {
              provider: 'google',
              providerAccountId: profile.sub,
              email,
            },
          },
        },
      })
    } else {
      const userCount = await prisma.user.count()
      user = await prisma.user.create({
        data: {
          name: profile.name || email,
          email,
          emailVerifiedAt: new Date(),
          role: userCount === 0 ? 'ADMIN' : 'USER',
          oauthAccounts: {
            create: {
              provider: 'google',
              providerAccountId: profile.sub,
              email,
            },
          },
        },
      })
    }
  }

  if (user.status !== 'ACTIVE') {
    throw createError({ statusCode: 403, statusMessage: 'Account is not active' })
  }

  await createUserSession(event, user.id)

  return sendRedirect(event, redirect, 302)
})
