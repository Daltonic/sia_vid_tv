/* eslint-disable @next/next/no-img-element */
import { FaTrash } from 'react-icons/fa'

interface ComponentProps {
  name: 'Poster' | 'Video'
  url: string
  onRemove: () => void
}

const Uploaded: React.FC<ComponentProps> = ({ name, url, onRemove }) => {
  return (
    <div className="flex flex-col justify-center shadow-md w-full h-32 rounded-lg overflow-hidden">
      <div className="relative w-full h-full ">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75"></div>
        {name.includes('video') ? (
          <video className="w-full h-full object-cover" src={url} />
        ) : (
          <img className="w-full h-full object-cover" src={url} alt="photo" />
        )}

        <div className="absolute top-12 left-24 bg-white text-green-600 rounded-full p-1 py-1.5">
          <span className="text-sm h-6 w-6">100%</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gray-700 rounded-full h-[2px]">
          <span className="bg-green-500 h-full w-[100%] flex"></span>
        </div>

        <button
          className="absolute top-1 right-1 text-white bg-black bg-opacity-70
        hover:text-red-500 rounded-full p-1"
          onClick={() => onRemove()}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default Uploaded
