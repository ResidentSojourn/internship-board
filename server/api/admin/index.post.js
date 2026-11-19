import { openAdminDatabase } from '../../utils/adminDatabase.js'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const email = typeof body.Email === 'string' ? body.Email.trim() : ''
  const requesterAdminID = Number(body.requesterAdminID)

  if (
    !emailPattern.test(email) ||
    !Number.isSafeInteger(requesterAdminID) ||
    requesterAdminID < 1 ||
    typeof body.isSuperAdmin !== 'boolean'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid admin information' })
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

  const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (queryError) {
      if (queryError) {
        reject(queryError)
      } else {
        resolve({ lastID: this.lastID })
      }
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

    const existingAdmin = await get(
      'SELECT AdminID FROM Admin WHERE Email = ? COLLATE NOCASE',
      [email]
    )

    if (existingAdmin) {
      throw createError({ statusCode: 409, statusMessage: 'Admin email already exists' })
    }

    const result = await run(
      'INSERT INTO Admin (Email, isSuperAdmin, isActive) VALUES (?, ?, 1)',
      [email, body.isSuperAdmin ? 1 : 0]
    )

    await run('COMMIT')

    return {
      success: true,
      AdminID: result.lastID
    }
  } catch (error) {
    try {
      await run('ROLLBACK')
    } catch {
      // Preserve the original error.
    }

    throw error
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
