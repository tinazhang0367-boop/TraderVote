import { createHash, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'
import { createError, getCookie, getRequestURL, setCookie } from 'h3'

const STATE_COOKIE = 'tv_oauth_state'
const VERIFIER_COOKIE = 'tv_oauth_verifier'
const REDIRECT_COOKIE = 'tv_oauth_redirect'
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

export interface GoogleUserInfo {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

export function getSiteUrl(event: H3Event) {
  const configured = process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_PUBLIC_BASE_URL
  if (configured) return configured.replace(/\/$/, '')

  const url = getRequestURL(event)
  return `${url.protocol}//${url.host}`
}

export function getGoogleRedirectUri(event: H3Event) {
  return process.env.GOOGLE_REDIRECT_URI || `${getSiteUrl(event)}/api/auth/google/callback`
}

export function getSafeRedirect(value: unknown) {
  const fallback = '/zh-CN'
  const redirect = String(value || fallback)
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return fallback
  return redirect
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url')
}

export function codeChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url')
}

export function setOAuthCookie(event: H3Event, name: string, value: string) {
  setCookie(event, name, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  })
}

export function setOAuthStartCookies(event: H3Event, state: string, verifier: string, redirect: string) {
  setOAuthCookie(event, STATE_COOKIE, state)
  setOAuthCookie(event, VERIFIER_COOKIE, verifier)
  setOAuthCookie(event, REDIRECT_COOKIE, redirect)
}

export function readOAuthState(event: H3Event) {
  return {
    state: getCookie(event, STATE_COOKIE),
    verifier: getCookie(event, VERIFIER_COOKIE),
    redirect: getSafeRedirect(getCookie(event, REDIRECT_COOKIE)),
  }
}

export function buildGoogleAuthUrl(event: H3Event, state: string, verifier: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'Google login is not configured' })
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(event),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge(verifier),
    code_challenge_method: 'S256',
    prompt: 'select_account',
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeGoogleCode(event: H3Event, code: string, verifier: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Google login is not configured' })
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: verifier,
      grant_type: 'authorization_code',
      redirect_uri: getGoogleRedirectUri(event),
    }),
  })

  if (!response.ok) {
    throw createError({ statusCode: 401, statusMessage: 'Google authorization failed' })
  }

  return await response.json() as { access_token?: string; id_token?: string }
}

export async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw createError({ statusCode: 401, statusMessage: 'Could not read Google profile' })
  }

  return await response.json() as GoogleUserInfo
}
