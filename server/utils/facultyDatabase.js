import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export async function openFacultyDatabase() {
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
      db.all('PRAGMA table_info(Faculty)', [], (queryError, rows) => {
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
          'ALTER TABLE Faculty ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1',
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

export async function assertCanManageInternship(db, internshipId, requesterFacultyID) {
  const requester = await new Promise((resolve, reject) => {
    db.get(
      'SELECT isAdmin FROM Faculty WHERE FacultyID = ?',
      [requesterFacultyID],
      (queryError, row) => {
        if (queryError) reject(queryError)
        else resolve(row)
      }
    )
  })

  if (!requester) {
    throw createError({ statusCode: 403, statusMessage: 'Faculty access required' })
  }

  const internship = await new Promise((resolve, reject) => {
    db.get(
      'SELECT FacultyID FROM Internship WHERE InternshipID = ?',
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

  if (Number(requester.isAdmin) !== 1 && Number(internship.FacultyID) !== requesterFacultyID) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot manage this internship' })
  }

  return internship
}
