import { PosterInterface } from '@/utils/interfaces'
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios'

const fetchMovies = async (
  pageSize: number | null = null,
  userId: string | null = null
) => {
  let url = '/api/movies/all'
  if (pageSize !== null) url += `?pageSize=${pageSize}`
  if (userId !== null) {
    if (url.includes('?')) {
      url += `&userId=${userId}`
    } else {
      url += `?userId=${userId}`
    }
  }

  const res = await fetch(url, {
    cache: 'no-store',
  })

  const moviesData: PosterInterface[] = await res.json()
  return moviesData
}

const fetchMovie = async (slug: string) => {
  let url = `/api/movies/${slug}`

  const res = await fetch(url, {
    cache: 'no-store',
  })

  const moviesData: PosterInterface[] = await res.json()
  return moviesData[0]
}

const createMovie = async (movieData: any) => {
  try {
    const response = await fetch('/api/movies/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    throw error
  }
}

const updateMovie = async (movieData: PosterInterface) => {
  try {
    const response = await fetch('/api/movies/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    throw error
  }
}

const deleteMovie = async (movieData: PosterInterface) => {
  try {
    const response = await fetch('/api/movies/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    throw error
  }
}

const uploadFile = async (
  file: File,
  onProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const url = process.env.NEXT_PUBLIC_FILE_SERVICE_URL + '/upload'
  const formData = new FormData()
  formData.append('file', file)

  const config: AxiosRequestConfig<FormData> = {
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: onProgress,
  }

  try {
    const response = await axios.request(config)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

export { fetchMovies, fetchMovie, createMovie, updateMovie, deleteMovie, uploadFile }
