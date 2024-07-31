import React from 'react'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'
import { PosterInterface } from '@/utils/interfaces'
import Link from 'next/link'

const MovieCard = ({
  movie,
  width = 'w-52',
  height = 'h-96',
}: {
  movie: PosterInterface
  width?: string
  height?: string
}) => {
  return (
    <div
      className={`relative ${width} ${height} overflow-hidden
      transform transition-transform duration-500 hover:rotate-y-180 group`}
    >
      <Link href={`/movies/${movie.slug}`}>
        <Image
          src={movie.image}
          alt={movie.name}
          width={400}
          height={700}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <div
          className="absolute inset-0 bg-black bg-opacity-75 text-white p-4
      opacity-0 group-hover:opacity-100 transform 
      rotate-y-180 transition duration-300 ease-in-out"
        >
          <div className="flex items-center justify-end space-x-2 mb-2">
            <FaStar className="text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold">
            {movie.name} ({movie.release})
          </h3>
          <p>{movie.background}</p>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
