import db from './database'

const migrate = () => {
  db.serialize(() => {
    // Create the movies table without the ON UPDATE clause
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
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP
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

    // Create a trigger to automatically update the updatedAt field
    db.run(
      `
      CREATE TRIGGER IF NOT EXISTS update_movies_updated_at
      AFTER UPDATE ON movies
      BEGIN
        UPDATE movies SET updatedAt = CURRENT_TIMESTAMP WHERE ROWID IS UPDATED;
      END;
    `,
      (err: Error) => {
        if (err) {
          console.error(err.message)
        } else {
          console.log('Trigger to update updatedAt field created successfully.')
        }
      }
    )
  })
}

migrate()

export default migrate
