import { openFacultyDatabase } from '../../utils/facultyDatabase.js'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const rawRequesterId = getQuery(event).requesterFacultyID

  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty ID' })
  }

  const facultyId = Number(rawId)
  const requesterFacultyID = Number(rawRequesterId)

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

  try {
    const requester = await get(
      'SELECT isAdmin FROM Faculty WHERE FacultyID = ?',
      [requesterFacultyID]
    )

    if (!requester || Number(requester.isAdmin) !== 1) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const faculty = await get(
      'SELECT FacultyID, Email, isAdmin, isActive FROM Faculty WHERE FacultyID = ? AND isActive = 1',
      [facultyId]
    )

    if (!faculty) {
      throw createError({ statusCode: 404, statusMessage: 'Faculty member not found' })
    }

    return faculty
  } finally {
    await new Promise((resolve, reject) => {
      db.close(closeError => closeError ? reject(closeError) : resolve())
    })
  }
})
