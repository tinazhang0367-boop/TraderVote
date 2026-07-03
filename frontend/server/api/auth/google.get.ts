import { getQuery, sendRedirect } from 'h3'
import { buildGoogleAuthUrl, getSafeRedirect, randomToken, setOAuthStartCookies } from '../../utils/oauth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const redirect = getSafeRedirect(query.redirect)
  const state = randomToken()
  const verifier = randomToken(48)

  setOAuthStartCookies(event, state, verifier, redirect)

  return sendRedirect(event, buildGoogleAuthUrl(event, state, verifier), 302)
})
