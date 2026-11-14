
import { resolve } from 'node:path'
import sqlite3 from 'sqlite3'

const databasePath = resolve(process.cwd(), 'app', 'database', 'db.sqlite')

export default defineEventHandler(async () => {
    const db = await new Promise<sqlite3.Database>((resolve, reject) => {
        const database = new sqlite3.Database(
            databasePath,
            sqlite3.OPEN_READONLY,
            (openError) => {
                if (openError) {
                    reject(openError)
                    return
                }

                resolve(database)
            }
        )
    })

    const query = (sql: string) => new Promise<any[]>((resolve, reject) => {
        db.all(sql, [], (queryError, rows) => {
            if (queryError) {
                reject(queryError)
            } else {
                resolve(rows)
            }
        })
    })

    try {
        const Tags = await query(`
            SELECT
                Tag.TagID,
                Tag.TagTitle,
                Tag.CategoryID,
                TagCategory.Category
            FROM Tag
            LEFT JOIN TagCategory
                ON TagCategory.CategoryID = Tag.CategoryID
            ORDER BY TagCategory.Category, Tag.TagTitle
        `)

        return Tags
    } finally {
        await new Promise<void>((resolve, reject) => {
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
