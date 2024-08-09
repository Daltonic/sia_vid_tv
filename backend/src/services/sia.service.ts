import path from 'path'
import fs from 'fs'
import { FileUpload } from 'utils/interfaces'
import { pipeline, Readable } from 'stream'
import { promisify } from 'util'
import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

class SiaService {
  private siaBucket: string
  private siaUrl: string
  private siaPassword: string
  private baseUrl: string

  constructor() {
    this.siaBucket = process.env.SIA_API_BUCKET || ''
    this.siaUrl = process.env.SIA_API_BASE_URL || ''
    this.siaPassword = process.env.SIA_API_PASSWORD || ''
    this.baseUrl = process.env.ORIGIN || ''
    
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

      const dirPath = path.dirname(localFilePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      const writeStream = fs.createWriteStream(localFilePath)
      const dataStream =
        file.data instanceof Buffer ? Readable.from(file.data) : file.data
      await promisify(pipeline)(dataStream, writeStream)

      // Upload the file to the Sia renterd
      this.uploadToSiaRenterd(file, folder, fileId)
      return {
        url: `${this.baseUrl}/download/${folder}/${fileId}`,
        message: 'File successfully uploaded',
      }
    } catch (error: any) {
      console.error(error.message)
      throw new Error(error.message || 'Error uploading file')
    }
  }

  private async uploadToSiaRenterd(
    file: FileUpload,
    folder: string,
    fileId: string
  ): Promise<AxiosResponse> {
    const url: string = `${this.siaUrl}/api/worker/objects/${folder}/${fileId}?bucket=${this.siaBucket}`

    const config: AxiosRequestConfig = {
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
    } catch (error: any) {
      throw new Error(error.message || 'Error uploading file')
    }
  }

  public async downloadFile(
    folder: string,
    fileId: string
  ): Promise<NodeJS.ReadableStream> {
    const fileStream = await this.downloadFromSiaRenterd(folder, fileId)
    
    // Return the file stream
    return fileStream
  }

  private async downloadFromSiaRenterd(
    folder: string,
    fileId: string
  ): Promise<NodeJS.ReadableStream> {
    const url: string = `${this.siaUrl}/api/worker/objects/${folder}/${fileId}?bucket=${this.siaBucket}`

    const config: AxiosRequestConfig = {
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

      const dirPath = path.dirname(localFilePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      const fileExists = fs.existsSync(localFilePath)
      if (fileExists) {
        return fs.createReadStream(localFilePath)
      } else {
        const response = await axios.request(config)
        const writeStream = fs.createWriteStream(localFilePath)
        promisify(pipeline)(response.data, writeStream)
        return response.data
      }
    } catch (error: any) {
      console.log(error)
      const _404 = path.resolve(
        __dirname,
        '..',
        '..',
        'response_files',
        '404.png'
      )
      return fs.createReadStream(_404)
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
