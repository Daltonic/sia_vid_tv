import { StaticImageData } from 'next/image'

export interface MovieInterface {
  id: number
  name: string
  image: StaticImageData
  release: string
  genre: string
  rating: string
  language: string
  duration: string
  tagline: string
  background: string
}

export interface PosterInterface {
  id: number
  userId: string
  name: string
  image: StaticImageData | string
  videoUrl: string
  slug: string
  release: string | number
  genre: string
  rating: string
  language: string
  duration: string
  background: string
}

export interface FileUpload {
  name: string
  data: Buffer
  size: number
  encoding?: string
  tempFilePath?: string
  truncated: boolean
  mimetype: string
  md5?: string
  mv?: Function
}
