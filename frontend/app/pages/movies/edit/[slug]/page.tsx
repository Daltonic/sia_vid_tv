'use client'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { AiOutlineClose } from 'react-icons/ai'
import { LuPlus } from 'react-icons/lu'
import { fetchMovie, updateMovie } from '@/app/services/api.service'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { PosterInterface } from '@/utils/interfaces'
import Link from 'next/link'

export default function Page() {
  const { slug } = useParams()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [movie, setMovie] = useState<PosterInterface | null>(null)
  const [videos, setVideos] = useState<File[]>([])
  const [movieDetails, setMovieDetails] = useState({
    name: '',
    image: '',
    videoUrl: 'https://pixeldrain.com/api/file/kZRgPKJb',
    background: '',
    genre: '',
    duration: '',
    release: '',
    rating: '',
    language: '',
  })

  useEffect(() => {
    const fetchMovieData = async () => {
      const movieData = await fetchMovie(slug as string)
      setMovieDetails(movieData as any)
      setMovie(movieData)
      console.log(address)
    }

    fetchMovieData()
  }, [slug, address, isDisconnected])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        updateMovie({ ...movie, ...movieDetails } as PosterInterface)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Updating...',
        success: 'Movie updated successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const onUpload = () => {
    if (!movieDetails.name || !movieDetails.background || !movieDetails.genre)
      return alert('Empty filed detected!')
    console.log({ video: videos[0], ...movieDetails })
  }

  const handleRemoveVideo = () => {
    setVideos([])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setMovieDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]

    // Check file size
    if (file.size > 100 * 1024 * 1024) {
      // 150 MB in bytes
      alert('File size must be less than 100MB.')
      return
    }

    // Check file type
    if (!file.type.startsWith('video/mp4')) {
      alert('Only MP4 files are allowed.')
      return
    }

    setVideos([file])
  }

  const handleClickOpenFileExplorer = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.mp4' // Limit file types to MP4
    fileInput.style.display = 'none' // Hide the file input

    const handleFileSelection = (event: Event) => {
      // Use event.currentTarget to access the input element
      const target = event.currentTarget as HTMLInputElement
      const file = target.files?.[0] // Now safely accessing the files property

      if (!file) return

      // Check file size
      if (file.size > 100 * 1024 * 1024) {
        // 150 MB in bytes
        alert('File size must be less than 100MB.')
        return
      }

      // Check file type
      if (!file.type.startsWith('video/mp4')) {
        alert('Only MP4 files are allowed.')
        return
      }

      setVideos([file])
    }

    // Attach the modified event listener
    fileInput.onchange = handleFileSelection

    // Append the file input to the body temporarily
    document.body.appendChild(fileInput)
    fileInput.click() // Open the file dialog

    // Remove the file input after the dialog is closed
    fileInput.addEventListener('change', () => {
      document.body.removeChild(fileInput)
    })
  }

  return (
    <div className="flex flex-col items-center">
      <Link href={'/movies/' + movie?.slug} className="mb-4 text-green-500">
        Back to movie
      </Link>
      <div className="bg-gray-800 bg-opacity-75 border border-slate-500 w-full md:w-2/5 p-4 rounded-xl text-slate-200">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex justify-between items-center space-x-2 w-full">
            {videos.length < 1 && (
              <div
                className="flex flex-col items-center border-dashed border-2
            border-slate-500 w-full h-32 justify-center rounded-xl
            cursor-pointer hover:border-green-500"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClickOpenFileExplorer}
              >
                <LuPlus className="text-3xl" />
                <p>Upload Video</p>
                <p className="text-sm text-slate-400">100mb Max</p>
              </div>
            )}
            {videos.length < 1 && (
              <div
                className="flex flex-col items-center border-dashed border-2
            border-slate-500 w-full h-32 justify-center rounded-xl
            cursor-pointer hover:border-green-500"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClickOpenFileExplorer}
              >
                <LuPlus className="text-3xl" />
                <p>Upload Photo</p>
                <p className="text-sm text-slate-400">2mb Max</p>
              </div>
            )}
          </div>

          {videos.length > 0 && (
            <div className="w-full flex flex-col justify-center">
              <div className="relative w-full h-40 border border-slate-400 rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(videos[0])}
                  controls
                />
                <button
                  className="absolute top-1 right-1 text-white bg-red-600 rounded-full p-1"
                  onClick={handleRemoveVideo}
                >
                  <AiOutlineClose />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="E.g. Batman Return"
                value={movieDetails.name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                required
              />
            </div>

            <div className="flex justify-between items-center space-x-2 mb-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Genres
                </label>
                <input
                  type="text"
                  name="genre"
                  placeholder="E.g. Action"
                  value={movieDetails.genre}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  placeholder="E.g. Russian"
                  value={movieDetails.language}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center space-x-2 mb-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  placeholder="E.g. 2h 19m"
                  value={movieDetails.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Release
                </label>
                <input
                  type="text"
                  name="release"
                  placeholder="E.g. 2020"
                  value={movieDetails.release}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Rating
                </label>
                <input
                  type="text"
                  name="rating"
                  placeholder="E.g. PG"
                  value={movieDetails.rating}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Background
              </label>
              <input
                type="text"
                name="background"
                placeholder="Synopsis of the movie..."
                value={movieDetails.background}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-slate-500 rounded text-sm"
              />

              <small className="text-slate-400">
                Keep all inputs short and simple no lengthy words needed.
              </small>
            </div>

            {movie && movie.userId === address && (
              <button
                className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-transparent
              hover:border-green-800 border border-transparent hover:text-green-500"
              >
                Update
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
