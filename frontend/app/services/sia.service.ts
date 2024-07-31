import 'dotenv/config'
import { FileUpload } from '@/utils/interfaces'
import axios, { AxiosResponse } from 'axios'
import fs from 'fs'
import path from 'path'

class SiaService {
  private siaUrl: string
  private siaPassword: string
  private siaBucket: string

  constructor() {
    this.siaUrl = String(process.env.NEXT_PUBLIC_SIA_BASE_URL)
    this.siaPassword = String(process.env.NEXT_PUBLIC_SIA_API_PASSWORD)
    this.siaBucket = String(process.env.NEXT_PUBLIC_SIA_API_BUCKET)
  }

  public async uploadFile(file: FileUpload): Promise<object | Error> {
    try {
      const timestamp = Date.now().toString()
      const randomString = this.generateRandomString(4)
      const identifier = `${timestamp}__${randomString}`

      const folder = file.mimetype.split('/')[0]
      const extension = file.mimetype.split('/')[1]
      const fileId = `${identifier}.${extension}`

      // Upload the file to Sia service
      this.uploadToSiaService(file, folder, fileId)

      return {
        url: `/downloader/${folder}/${fileId}`,
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
        'Content-Type': file.mimetype, // Set the correct MIME type for the file
      },
      data: file.data, // Pass the stream as the data
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
      const response = await axios.request(config)
      return response.data
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
