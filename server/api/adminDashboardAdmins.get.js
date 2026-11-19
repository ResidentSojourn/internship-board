import { openAdminDatabase } from '../utils/adminDatabase.js'

export default defineEventHandler(async (event) => {
  const rawAdminId = getQuery(event).adminID

  if (typeof rawAdminId !== 'string' || !/^\d+$/.test(rawAdminId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin ID' })
  }

  const adminID = Number(rawAdminId)

  if (!Number.isSafeInteger(adminID) || adminID < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin ID' })
  }

  const db = await openAdminDatabase()

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
    const currentAdmin = await get(
      'SELECT isSuperAdmin FROM Admin WHERE AdminID = ?',
      [adminID]
    )

    if (!currentAdmin) {
      throw createError({ statusCode: 404, statusMessage: 'Admin not found' })
    }

    if (Number(currentAdmin.isSuperAdmin) !== 1) {
      return { isSuperAdmin: false, admins: [] }
    }

    const admins = await all(
      'SELECT AdminID, Email, isSuperAdmin, isActive FROM Admin WHERE isActive = 1 ORDER BY Email'
    )

    return { isSuperAdmin: true, admins }
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
