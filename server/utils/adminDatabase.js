import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export async function openAdminDatabase() {
  const db = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (openError) => {
      if (openError) {
        reject(openError)
      } else {
        resolve(database)
      }
    })
  })

  try {
    const columns = await new Promise((resolve, reject) => {
      db.all('PRAGMA table_info(Admin)', [], (queryError, rows) => {
        if (queryError) {
          reject(queryError)
        } else {
          resolve(rows)
        }
      })
    })

    if (!columns.some(column => column.name === 'isActive')) {
      await new Promise((resolve, reject) => {
        db.run(
          'ALTER TABLE Admin ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1',
          (migrationError) => {
            if (migrationError) {
              reject(migrationError)
            } else {
              resolve()
            }
          }
        )
      })
    }

    return db
  } catch (error) {
    await new Promise((resolve, reject) => {
      db.close(closeError => closeError ? reject(closeError) : resolve())
    })
    throw error
  }
}

export async function assertCanManageInternship(db, internshipId, requesterAdminID) {
  const requester = await new Promise((resolve, reject) => {
    db.get(
      'SELECT isSuperAdmin FROM Admin WHERE AdminID = ?',
      [requesterAdminID],
      (queryError, row) => {
        if (queryError) reject(queryError)
        else resolve(row)
      }
    )
  })

  if (!requester) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const internship = await new Promise((resolve, reject) => {
    db.get(
      'SELECT AdminID FROM Internship WHERE InternshipID = ?',
      [internshipId],
      (queryError, row) => {
        if (queryError) reject(queryError)
        else resolve(row)
      }
    )
  })

  if (!internship) {
    throw createError({ statusCode: 404, statusMessage: 'Internship not found' })
  }

  if (Number(requester.isSuperAdmin) !== 1 && Number(internship.AdminID) !== requesterAdminID) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot manage this internship' })
  }

  return internship
}