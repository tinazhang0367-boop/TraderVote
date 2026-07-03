import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) return null

  return { id: user.id, name: user.name, email: user.email, role: user.role, emailVerifiedAt: user.emailVerifiedAt }
})
