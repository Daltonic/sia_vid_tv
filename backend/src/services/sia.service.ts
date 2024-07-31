require('dotenv').config()
import { FileUpload } from '../utils/interfaces'
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios'
import fs from 'fs'
import path from 'path'
import { Readable, pipeline } from 'stream'
import { promisify } from 'util'

class SiaService {
  private siaBucket: string
  private siaUrl: string
  private siaPassword: string
  private baseUrl: string

  constructor() {
    this.siaBucket = String(process.env.SIA_API_BUCKET)
    this.siaUrl = String(process.env.SIA_API_BASE_URL)
    this.siaPassword = String(process.env.SIA_API_PASSWORD)
    this.baseUrl = String(process.env.ORIGIN)
  }

  public async uploadFile(file: FileUpload): Promise<object | Error> {
    try {
      const timestamp = Date.now().toString()
      const randomString = this.generateRandomString(4)
      const identifier = `${timestamp}__${randomString}`

      const folder = file.mimetype.split('/')[0]
      const extension = file.mimetype.split('/')[1]
      const fileId = `${identifier}.${extension}`

      const cacheDir = path.resolve(__dirname, '..', '..', 'cache')
      const localFilePath = path.join(cacheDir, folder, fileId)

      // Ensure the directory exists
      const dirPath = path.dirname(localFilePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      // Save the file to the local cache
      const writeStream = fs.createWriteStream(localFilePath)
      const dataStream =
        file.data instanceof Buffer ? Readable.from(file.data) : file.data
      await promisify(pipeline)(dataStream, writeStream)

      // Upload the file to Sia service
      this.uploadToSiaService(file, folder, fileId)

      return {
        url: `${this.baseUrl}/download/${folder}/${fileId}`,
        message: 'File successfully uploaded!',
      }
    } catch (e: any) {
      console.error(e.message)
      throw new Error(e.message || 'Error uploading file')
    }
  }

  private async uploadToSiaService(
    file: FileUpload,
    folder: string,
    fileId: string
  ): Promise<AxiosResponse> {
    const url: string = `${this.siaUrl}/api/worker/objects/${folder}/${fileId}?bucket=${this.siaBucket}`

    let config = {
      method: 'PUT',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Basic ${Buffer.from(`:${this.siaPassword}`).toString(
          'base64'
        )}`,
        'Content-Type': file.mimetype,
      },
      data: file.data,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const { loaded, total } = progressEvent
        const percentCompleted = Math.round((loaded / Number(total)) * 100)
        console.log(`Upload progress: ${percentCompleted}%`)
      },
    }

    try {
      return await axios.request(config)
    } catch (e: any) {
      console.error(e.message)
      throw new Error(e.message || 'Error uploading file')
    }
  }

  public async downloadFile(
    folder: string,
    fileId: string
  ): Promise<NodeJS.ReadableStream> {
    const fileStream = await this.downloadFromSiaService(folder, fileId)

    // Return the file stream
    return fileStream
  }

  private async downloadFromSiaService(
    folder: string,
    fileId: string
  ): Promise<NodeJS.ReadableStream> {
    let url: string = `${this.siaUrl}/api/worker/objects/${folder}/${fileId}?bucket=${this.siaBucket}`

    let config = {
      method: 'GET',
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: `Basic ${Buffer.from(`:${this.siaPassword}`).toString(
          'base64'
        )}`,
      },
      responseType: 'stream' as const,
    }

    try {
      const cacheDir = path.resolve(__dirname, '..', '..', 'cache')
      const localFilePath = path.join(cacheDir, folder, fileId)

      // Ensure the cache directory exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }

      // Ensure the folder directory exists
      const folderDir = path.join(cacheDir, folder)
      if (!fs.existsSync(folderDir)) {
        fs.mkdirSync(folderDir, { recursive: true })
      }

      // Save the file to the local cache
      const fileExists = fs.existsSync(localFilePath)

      if (fileExists) {
        // If the file exists in the local cache, return it
        return fs.createReadStream(localFilePath)
      } else {
        // Return the file stream
        const response = await axios.request(config)
        const writeStream = fs.createWriteStream(localFilePath)
        promisify(pipeline)(response.data, writeStream)
        return response.data
      }
    } catch (e: any) {
      console.error(e)
      if (e.response && e.response.status === 404) {
        const notFound = path.resolve(
          __dirname,
          '..',
          '..',
          'response_files',
          '404.png'
        )
        return fs.createReadStream(notFound)
      } else {
      }
      throw new Error(e.message || 'Error downloading file')
    }
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}

export default SiaService
