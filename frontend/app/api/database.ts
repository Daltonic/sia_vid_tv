import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.join(process.cwd(), 'movies.db')
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err: any) => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the movie database.')
  }
)

export const apiGet = async (query: any) => {
  return await new Promise((resolve, reject) => {
    db.all(query, (err: Error, row: any) => {
      if (err) {
        console.log(err)
        return reject(err)
      }

      return resolve(row)
    })
  })
}

export const apiPost = async (query: any, values: string[]) => {
  return await new Promise((resolve, reject) => {
    db.run(query, values, (err: Error) => {
      if (err) {
        console.log(err)
        return reject(err)
      }

      return resolve(null)
    })
  })
}

export default db
