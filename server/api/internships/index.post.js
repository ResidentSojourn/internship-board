import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body',
        })
    }

    // Validate required fields
    if (
        typeof body.Title !== 'string' ||
        !body.Title.trim() ||
        !Array.isArray(body.tagIDs) ||
        !Number.isSafeInteger(Number(body.FacultyID)) ||
        Number(body.FacultyID) < 1
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing or invalid internship information',
        })
    }

    const tagIDs = [...new Set(body.tagIDs.map(Number))]

    if (!tagIDs.every(id => Number.isSafeInteger(id) && id > 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid tag ID',
        })
    }

    const db = await new Promise((resolve, reject) => {
        const database = new sqlite3.Database(
            databasePath,
            sqlite3.OPEN_READWRITE,
            (error) => {
                if (error) reject(error)
                else resolve(database)
            }
        )
    })

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
                else resolve({
                    lastID: this.lastID,
                    changes: this.changes,
                })
            })
        })

    try {
        await run('BEGIN TRANSACTION')

        // Verify faculty exists
        const faculty = await query(
            'SELECT FacultyID FROM Faculty WHERE FacultyID = ?',
            [body.FacultyID]
        )

        if (faculty.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faculty member not found',
            })
        }

        // Verify all tags exist
        if (tagIDs.length > 0) {
            const placeholders = tagIDs.map(() => '?').join(', ')

            const tags = await query(
                `SELECT TagID FROM Tag WHERE TagID IN (${placeholders})`,
                tagIDs
            )

            if (tags.length !== tagIDs.length) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'One or more tag IDs do not exist',
                })
            }
        }

        // Insert internship
        const result = await run(
            `INSERT INTO Internship
                (Title, Description, ExpDate, Link, FacultyID, PostDate)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                body.Title.trim(),
                body.Description ?? '',
                body.ExpDate || null,
                body.Link ?? '',
                body.FacultyID,
                new Date().toISOString().slice(0, 10),
            ]
        )

        const internshipId = result.lastID

        // Insert associated tags
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
            tagIDs,
        }

    } catch (error) {
        try {
            await run('ROLLBACK')
        } catch {
            // Preserve original error
        }

        throw error

    } finally {
        await new Promise((resolve, reject) => {
            db.close(error => {
                if (error) reject(error)
                else resolve()
            })
        })
    }
})