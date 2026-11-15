import { openFacultyDatabase } from '../../utils/facultyDatabase.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const email = typeof body.Email === 'string' ? body.Email.trim() : ''

  if (
    !Number.isSafeInteger(facultyId) || facultyId < 1 ||
    !Number.isSafeInteger(requesterFacultyID) || requesterFacultyID < 1 ||
    !emailPattern.test(email) ||
    typeof body.isAdmin !== 'boolean'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty information' })
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

    const faculty = await get(
      'SELECT FacultyID FROM Faculty WHERE FacultyID = ? AND isActive = 1',
      [facultyId]
    )

    if (!faculty) {
      throw createError({ statusCode: 404, statusMessage: 'Faculty member not found' })
    }

    const duplicate = await get(
      'SELECT FacultyID FROM Faculty WHERE Email = ? COLLATE NOCASE AND FacultyID != ?',
      [email, facultyId]
    )

    if (duplicate) {
      throw createError({ statusCode: 409, statusMessage: 'Faculty email already exists' })
    }

    await run(
      'UPDATE Faculty SET Email = ?, isAdmin = ? WHERE FacultyID = ? AND isActive = 1',
      [email, body.isAdmin ? 1 : 0, facultyId]
    )
    await run('COMMIT')

    return { success: true, FacultyID: facultyId }
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
