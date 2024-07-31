import fs from 'fs'
import path from 'path'
import cron from 'node-cron'

class BackgroundService {
  private cacheDir: string

  constructor() {
    this.cacheDir = path.resolve(__dirname, '..', '..', 'cache')
    this.dailyJobs()
    console.log('Background jobs mounted...')
  }

  private dailyJobs(): void {
    // Schedule the cleanup to run every day at  00:00
    cron.schedule('0  0 * * *', () => {
      this.deleteOldFiles()
    })
  }

  public deleteOldFiles(): void {
    console.log('Starting deleteOldFiles job at:', new Date().toISOString())
    fs.readdir(this.cacheDir, (err, folders) => {
      if (err) {
        console.error('Error reading cache directory:', err)
        return
      }

      folders.forEach((folder) => {
        const folderPath = path.join(this.cacheDir, folder)
        fs.readdir(folderPath, (err, files) => {
          if (err) {
            console.error('Error reading folder:', err)
            return
          }

          files.forEach((file) => {
            const fileCreatedAt: number = Number(file.split('__')[0])
            const targetTime: number = fileCreatedAt + 7 * 24 * 60 * 60 * 1000

            if (Date.now() > targetTime) {
              // The file is greater than target from its creation time
              const filePath = path.join(folderPath, file)
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(`Error deleting file ${filePath}:`, err)
                } else {
                  console.log(
                    `${folder}: ${file} expired and removed from cache`
                  )
                }
              })
            }
          })
        })
      })
    })
    console.log('Finished deleteOldFiles job at:', new Date().toISOString())
  }
}

export default BackgroundService
