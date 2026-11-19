import { openFacultyDatabase as openAdminDatabase } from '../../utils/facultyDatabase.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const email = typeof body.Email === 'string' ? body.Email.trim() : ''

  if (
    !Number.isSafeInteger(adminID) || adminID < 1 ||
    !Number.isSafeInteger(requesterAdminID) || requesterAdminID < 1 ||
    !emailPattern.test(email) ||
    typeof body.isSuperAdmin !== 'boolean'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin information' })
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
      'SELECT isAdmin FROM Faculty WHERE FacultyID = ?',
      [requesterAdminID]
    )

    if (!requester || Number(requester.isAdmin) !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const admin = await get(
      'SELECT FacultyID FROM Faculty WHERE FacultyID = ? AND isActive = 1',
      [adminID]
    )

    if (!admin) {
      throw createError({ statusCode: 404, statusMessage: 'Admin not found' })
    }

    const duplicate = await get(
      'SELECT FacultyID FROM Faculty WHERE Email = ? COLLATE NOCASE AND FacultyID != ?',
      [email, adminID]
    )

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: 'Admin email already exists' })
    }

    await run(
      'UPDATE Faculty SET Email = ?, isAdmin = ? WHERE FacultyID = ? AND isActive = 1',
      [email, body.isSuperAdmin ? 1 : 0, adminID]
    )
    await run('COMMIT')

    return { success: true, AdminID: adminID }
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
