import { openFacultyDatabase } from '../utils/facultyDatabase.js'

export default defineEventHandler(async (event) => {
  const rawFacultyId = getQuery(event).facultyID

  if (typeof rawFacultyId !== 'string' || !/^\d+$/.test(rawFacultyId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty ID' })
  }

  const facultyId = Number(rawFacultyId)

  if (!Number.isSafeInteger(facultyId) || facultyId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid faculty ID' })
  }

  const db = await openFacultyDatabase()

  const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (queryError, row) => {
      if (queryError) {
        reject(queryError)
      } else {
        resolve(row)
      }
    })
  })

  const all = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (queryError, rows) => {
      if (queryError) {
        reject(queryError)
      } else {
        resolve(rows)
      }
    })
  })

  try {
    const currentFaculty = await get(
      'SELECT isAdmin FROM Faculty WHERE FacultyID = ?',
      [facultyId]
    )

    if (!currentFaculty) {
      throw createError({ statusCode: 404, statusMessage: 'Faculty member not found' })
    }

    if (Number(currentFaculty.isAdmin) !== 1) {
      return { isAdmin: false, faculty: [] }
    }

    const faculty = await all(
      'SELECT FacultyID, Email, isAdmin, isActive FROM Faculty WHERE isActive = 1 ORDER BY Email'
    )

    return { isAdmin: true, faculty }
  } finally {
    await new Promise((resolve, reject) => {
      db.close((closeError) => {
        if (closeError) {
          reject(closeError)
        } else {
          resolve()
        }
      })
    })
  }
})
