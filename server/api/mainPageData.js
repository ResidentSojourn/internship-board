import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export default defineEventHandler(async () => {
  const db = await new Promise((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, (openError) => {
      if (openError) {
        reject(openError)
        return
      }

      resolve(database)
    })
  })

  const query = (sql) => new Promise((resolve, reject) => {
    db.all(sql, [], (queryError, rows) => {
      if (queryError) {
        reject(queryError)
      } else {
        resolve(rows)
      }
    })
  })

  try {
    const [Internships, Tags, InterTags] = await Promise.all([
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
          Employer.Company AS EmployerCompany
        FROM Internship
        LEFT JOIN Employer ON Employer.EmployerID = Internship.EmployerID
      `),
      query(`
        SELECT Tag.TagID, Tag.TagTitle, Tag.CategoryID, TagCategory.Category
        FROM Tag
        LEFT JOIN TagCategory ON TagCategory.CategoryID = Tag.CategoryID
      `),
      query('SELECT InternshipID, TagID FROM InterTag'),
    ])

    return { Internships, Tags, InterTags }
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
