import { openFacultyDatabase } from '../../utils/facultyDatabase.js'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty ID' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const facultyId = Number(rawId)
  const requesterFacultyID = Number(body.requesterFacultyID)

  if (
    !Number.isSafeInteger(facultyId) || facultyId < 1 ||
    !Number.isSafeInteger(requesterFacultyID) || requesterFacultyID < 1
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty ID' })
  }

  const db = await openFacultyDatabase()
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
      [requesterFacultyID]
    )

    if (!requester || Number(requester.isAdmin) !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const result = await run(
      'UPDATE Faculty SET isActive = 0 WHERE FacultyID = ? AND isActive = 1',
      [facultyId]
    )

    if (result.changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Active faculty member not found' })
    }

    await run('COMMIT')

    return { success: true, FacultyID: facultyId, isActive: 0 }
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
