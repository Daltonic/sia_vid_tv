import db from './database'

const migrate = () => {
  db.serialize(() => {
    db.run(
      `
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            image TEXT NOT NULL,
            videoUrl TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            release DATE NOT NULL,
            genre TEXT NOT NULL,
            rating TEXT NOT NULL,
            language TEXT NOT NULL,
            duration TEXT NOT NULL,
            background TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `,
      (err: Error) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log('movies table schema created successfully.')
        }
      }
    )
  })
}

migrate()
