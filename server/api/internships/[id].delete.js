
import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export default defineEventHandler(async (event) => {
    const rawId = getRouterParam(event, 'id')

    if (!rawId || !/^\d+$/.test(rawId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid internship ID'
        })
    }

    const internshipId = Number(rawId)

    if (!Number.isSafeInteger(internshipId) || internshipId < 1) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid internship ID'
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

    const run = (sql, params = []) =>
        new Promise((resolve, reject) => {
            db.run(sql, params, function (error) {
                if (error) reject(error)
                else resolve({ changes: this.changes })
            })
        })

    const get = (sql, params = []) =>
        new Promise((resolve, reject) => {
            db.get(sql, params, (error, row) => {
                if (error) reject(error)
                else resolve(row)
            })
        })

    try {
        await run('BEGIN TRANSACTION')

        const internship = await get(
            'SELECT InternshipID FROM Internship WHERE InternshipID = ?',
            [internshipId]
        )

        if (!internship) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Internship not found'
            })
        }

        // Remove associated tag assignments first.
        await run(
            'DELETE FROM InterTag WHERE InternshipID = ?',
            [internshipId]
        )

        // Delete the internship itself.
        await run(
            'DELETE FROM Internship WHERE InternshipID = ?',
            [internshipId]
        )

        await run('COMMIT')

        return {
            success: true,
            message: 'Internship deleted successfully',
            InternshipID: internshipId
        }

    } catch (error) {
        try {
            await run('ROLLBACK')
        } catch {
            // Preserve original error.
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
