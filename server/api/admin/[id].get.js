import { openAdminDatabase } from '../../utils/adminDatabase.js'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const rawRequesterId = getQuery(event).requesterAdminID

  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin ID' })
  }

  const adminID = Number(rawId)
  const requesterAdminID = Number(rawRequesterId)

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

  try {
    const requester = await get(
      'SELECT isSuperAdmin FROM Admin WHERE AdminID = ?',
      [requesterAdminID]
    )

    if (!requester || Number(requester.isSuperAdmin) !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const admin = await get(
      'SELECT AdminID, Email, isSuperAdmin, isActive FROM Admin WHERE AdminID = ? AND isActive = 1',
      [adminID]
    )

    if (!admin) {
      throw createError({ statusCode: 404, statusMessage: 'Admin not found' })
    }

    return admin
  } finally {
    await new Promise((resolve, reject) => {
      db.close(closeError => closeError ? reject(closeError) : resolve())
    })
  }
})
