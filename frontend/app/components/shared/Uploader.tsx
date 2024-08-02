/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { LuPlus } from 'react-icons/lu'
import { toast } from 'react-toastify'

interface ComponentProps {
  name: 'Poster' | 'Video'
  type: string // Ensure this accepts any valid MIME type string
  size: number
  onUploadSuccess: (response: any) => void
  onFileSelected: (file: any) => void
}

const Uploader: React.FC<ComponentProps> = ({
  type,
  size,
  name,
  onUploadSuccess,
  onFileSelected,
}) => {
  const [uploading, setUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState<File[]>([])

  const removeFile = () => {
    setFiles([])
  }

  const handleUploadProgress = (progressEvent: any) => {
    const { loaded, total } = progressEvent
    const percentCompleted = Math.round((loaded / Number(total)) * 100)
    console.log(`Upload progress: ${percentCompleted}%`)
    setProgress(percentCompleted)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]

    // Check file size
    if (file.size > size * 1024 * 1024) {
      alert(`File size must be less than ${size}MB.`)
      return
    }

    // Dynamically create regex for filetype validation
    const fileTypeRegex = createFileTypeRegex(type.split(', '))

    // Check file type
    if (!fileTypeRegex.test(file.type)) {
      alert(`Only ${type} files are allowed.`)
      return
    }

    onFileSelected(file)

    setFiles([file])
  }

  const createFileTypeRegex = (fileTypes: string[]): RegExp => {
    // Join the file types with the '|' character to indicate OR in regex
    const joinedFileTypes = fileTypes.join('|')
    return new RegExp(`^${joinedFileTypes}$`)
  }

  const handleClickOpenFileExplorer = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = type // Limit file types to MP4
    fileInput.style.display = 'none' // Hide the file input

    const handleFileSelection = (event: Event) => {
      // Use event.currentTarget to access the input element
      const target = event.currentTarget as HTMLInputElement
      const file = target.files?.[0] // Now safely accessing the files property

      if (!file) return

      // Check file size
      if (file.size > size * 1024 * 1024) {
        // 150 MB in bytes
        alert(`File size must be less than ${size}MB.`)
        return
      }

      // Dynamically create regex for filetype validation
      const fileTypeRegex = createFileTypeRegex(type.split(', '))

      // Check file type
      if (!fileTypeRegex.test(file.type)) {
        alert(`Only ${type} files are allowed.`)
        return
      }

      onFileSelected(file)

      setFiles([file])
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

  const handleUpload = async () => {
    setUploading(true)

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        onUploadSuccess('')
        console.log('Uploaded')
        resolve()
      }),
      {
        pending: 'Uploading...',
        success: 'File successfully uploaded 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <>
      {files.length < 1 && (
        <div
          className="flex flex-col items-center border-dashed border-2
        border-slate-500 w-full h-32 justify-center rounded-xl
        cursor-pointer hover:border-green-500"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickOpenFileExplorer}
        >
          <LuPlus className="text-3xl" />
          <p>Upload {name}</p>
          <p className="text-sm text-slate-400">{size}mb Max</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col justify-center shadow-md w-full h-32 rounded-lg overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75"></div>

            <div className="relative h-full">
              {type.includes('video') ? (
                <video
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(files[0])}
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(files[0])}
                  alt="photo"
                />
              )}

              {uploading ? (
                <>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-green-600 rounded-full p-1 py-1.5">
                    <span className="text-sm h-6 w-6">{progress}%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-700 rounded-full h-[2px]">
                    <span
                      className={`bg-green-500 h-full w-[${progress}%] flex`}
                    ></span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpload}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-white text-green-600 rounded-full p-1.5 py-1.5 
                    hover:bg-black hover:bg-opacity-70"
                  >
                    <FaCloudUploadAlt size={30} />
                  </button>
                  <button
                    className="absolute top-1 right-1 text-white bg-black bg-opacity-70
                  hover:text-red-500 rounded-full p-1"
                    onClick={removeFile}
                  >
                    <AiOutlineClose />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Uploader
