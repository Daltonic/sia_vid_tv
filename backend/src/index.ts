require('dotenv').config()
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import fileupload from 'express-fileupload'
import { StatusCodes } from 'http-status-codes'
import HttpException from './utils/HttpExceptions'
import { FileUpload } from './utils/interfaces'
import SiaService from './services/sia.service'
import BackgroundService from './services/background.service'

const app = express()
const port = process.env.PORT
const siaService = new SiaService()

app.use(cors())
app.use(fileupload())

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(StatusCodes.OK).json({ message: 'Welcome' })
  } catch (error: any) {
    next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
  }
})

app.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files) {
      throw new HttpException(StatusCodes.NO_CONTENT, 'No file uploaded')
    }

    const file: FileUpload = req.files.file as FileUpload
    const result = await siaService.uploadFile(file)

    return res.status(StatusCodes.CREATED).json(result)
  } catch (error: any) {
    next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
  }
})

app.get(
  '/download/:folder/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { folder, fileId } = req.params
    try {
      if (!folder || !fileId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Folder => ${folder} or File ID => ${fileId} empty`,
        })
      } else {
        const result = await siaService.downloadFile(folder, fileId)
        return result.pipe(res).status(StatusCodes.OK)
      }
    } catch (error: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, error.message))
    }
  }
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  new BackgroundService()
})
