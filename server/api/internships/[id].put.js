
import { assertCanManageInternship, openFacultyDatabase as openAdminDatabase } from '../../utils/facultyDatabase.js'

export default defineEventHandler(async (event) => {
  // Validate the internship ID from the URL
  const rawId = getRouterParam(event, 'id')

  if (!rawId || !/^\d+$/.test(rawId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid internship ID',
    })
  }

  const internshipId = Number(rawId)

  if (!Number.isSafeInteger(internshipId) || internshipId < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid internship ID',
    })
  }

  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  if (!Array.isArray(body.tagIDs)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'tagIDs must be an array',
    })
  }

  const requesterAdminID = Number(body.requesterAdminID)

  if (!Number.isSafeInteger(requesterAdminID) || requesterAdminID < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid requester admin ID',
    })
  }

  const tagIDs = [...new Set(body.tagIDs.map(Number))]

  if (!tagIDs.every(id => Number.isSafeInteger(id) && id > 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid tag ID',
    })
  }

  const db = await openAdminDatabase()

  const query = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, params, (error, rows) => {
        if (error) reject(error)
        else resolve(rows)
      })
    })

  const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, params, function (error) {
        if (error) reject(error)
        else resolve({ changes: this.changes })
      })
    })

  try {
    await run('BEGIN TRANSACTION')

    await assertCanManageInternship(db, internshipId, requesterAdminID)

    // Get the actual columns in the Internship table
    const columns = await query('PRAGMA table_info(Internship)')

    const allowedColumns = new Set(
      columns.map(column => column.name)
    )

    // Only update actual Internship columns
    // Ignore joined fields, tagIDs, and the primary key
    const fields = Object.keys(body).filter(key =>
      key !== 'InternshipID' &&
      key !== 'AdminID' &&
      key !== 'requesterAdminID' &&
      key !== 'tagIDs' &&
      allowedColumns.has(key)
    )

    if (fields.length > 0) {
      const assignments = fields
        .map(key => `"${key.replace(/"/g, '""')}" = ?`)
        .join(', ')

      const values = fields.map(key => body[key])

      await run(
        `UPDATE Internship
         SET ${assignments}
         WHERE InternshipID = ?`,
        [...values, internshipId]
      )
    }

    // Verify that all submitted tags exist
    if (tagIDs.length > 0) {
      const placeholders = tagIDs.map(() => '?').join(', ')

      const result = await query(
        `SELECT TagID FROM Tag
         WHERE TagID IN (${placeholders})`,
        tagIDs
      )

      if (result.length !== tagIDs.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'One or more tag IDs do not exist',
        })
      }
    }

    // Remove all previous tag assignments
    await run(
      'DELETE FROM InterTag WHERE InternshipID = ?',
      [internshipId]
    )

    // Insert the newly selected tags
    for (const tagID of tagIDs) {
      await run(
        `INSERT INTO InterTag (InternshipID, TagID)
         VALUES (?, ?)`,
        [internshipId, tagID]
      )
    }

    await run('COMMIT')

    return {
      success: true,
      InternshipID: internshipId,
      updatedFields: fields,
      tagIDs,
    }
  } catch (error) {
    try {
      await run('ROLLBACK')
    } catch {
      // Preserve the original error
    }

    throw error
  } finally {
    await new Promise((resolve, reject) => {
      db.close((closeError) => {
        if (closeError) reject(closeError)
        else resolve()
      })
    })
  }
})
