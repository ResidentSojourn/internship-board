import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid internship ID' })
  }

  const internshipId = Number(rawId)
  if (!Number.isSafeInteger(internshipId) || internshipId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid internship ID' })
  }

  const db = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (openError) => {
      if (openError) {
        reject(openError)
        return
      }

      resolve(database)
    })
  })

  const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (queryError, rows) => {
      if (queryError) {
        reject(queryError)
      } else {
        resolve(rows)
      }
    })
  })

  let internships
  let tags

  try {
    [internships, tags] = await Promise.all([
      query(`
        SELECT
          Internship.InternshipID,
          Internship.EmployerID,
          Internship.FacultyID AS AdminID,
          Internship.Title,
          Internship.Description,
          Internship.PostDate,
          Internship.ExpDate,
          Internship.Link,
          Employer.Name AS EmployerName,
          Employer.Company AS EmployerCompany,
          Employer.Contact AS EmployerContact,
          Faculty.Email AS AdminEmail
        FROM Internship
        LEFT JOIN Employer ON Employer.EmployerID = Internship.EmployerID
        LEFT JOIN Faculty ON Faculty.FacultyID = Internship.FacultyID
        WHERE Internship.InternshipID = ?
      `, [internshipId]),
      query(`
        SELECT Tag.TagID, Tag.TagTitle, Tag.CategoryID, TagCategory.Category
        FROM InterTag
        JOIN Tag ON Tag.TagID = InterTag.TagID
        LEFT JOIN TagCategory ON TagCategory.CategoryID = Tag.CategoryID
        WHERE InterTag.InternshipID = ?
        ORDER BY TagCategory.Category, Tag.TagTitle
      `, [internshipId]),
    ])
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

  if (internships.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Internship not found' })
  }

  return { internship: internships[0], tags }
})
