import { openAdminDatabase } from '../../utils/adminDatabase.js'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin ID' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const adminID = Number(rawId)
  const requesterAdminID = Number(body.requesterAdminID)

  if (
    !Number.isSafeInteger(adminID) || adminID < 1 ||
    !Number.isSafeInteger(requesterAdminID) || requesterAdminID < 1
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin ID' })
  }

  const db = await openAdminDatabase()
  const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (queryError, row) => {
      if (queryError) reject(queryError)
      else resolve(row)
    })
  })
  const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (queryError) {
      if (queryError) reject(queryError)
      else resolve({ changes: this.changes })
    })
  })

  try {
    await run('BEGIN IMMEDIATE')

    const requester = await get(
      'SELECT isSuperAdmin FROM Admin WHERE AdminID = ?',
      [requesterAdminID]
    )

    if (!requester || Number(requester.isSuperAdmin) !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const result = await run(
      'UPDATE Admin SET isActive = 0 WHERE AdminID = ? AND isActive = 1',
      [adminID]
    )

    if (result.changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Active admin not found' })
    }

    await run('COMMIT')

    return { success: true, AdminID: adminID, isActive: 0 }
  } catch (error) {
    try {
      await run('ROLLBACK')
    } catch {
      // Preserve the original error.
    }

    throw error
  } finally {
    await new Promise((resolve, reject) => {
      db.close(closeError => closeError ? reject(closeError) : resolve())
    })
  }
})
