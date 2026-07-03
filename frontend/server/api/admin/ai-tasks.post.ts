import { createError, readBody } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<{ type?: string; targetType?: string; targetId?: string; inputJson?: string }>(event) || {}
  const type = String(body.type || '').trim().toUpperCase()

  if (!type) {
    throw createError({ statusCode: 400, statusMessage: 'Task type required' })
  }

  const task = await prisma.aiTask.create({
    data: {
      type,
      targetType: body.targetType || null,
      targetId: body.targetId || null,
      inputJson: body.inputJson || null,
      status: 'QUEUED',
    },
  })

  return { ok: true, task }
})
