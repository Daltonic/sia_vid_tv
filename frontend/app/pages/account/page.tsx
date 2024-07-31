'use client'
import MovieCard from '@/app/components/shared/MovieCard'
import { useEffect, useState } from 'react'
import { PosterInterface } from '@/utils/interfaces'
import { fetchMovies } from '@/app/services/api.service'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useAccount } from 'wagmi'

const Page = () => {
  const [loaded, setLoaded] = useState(false)
  const [movies, setMovies] = useState<PosterInterface[]>([])
  const { address, isConnecting, isDisconnected } = useAccount()

  useEffect(() => {
    const fetchMovieData = async () => {
      if (address) {
        const moviesData = await fetchMovies(null, address)
        setMovies(moviesData)
      }
      setLoaded(true)
    }

    fetchMovieData()
  }, [address, isConnecting])

  return (
    <div className="flex flex-col w-full items-center">
      <h3 className="text-lg mb-4">
        {!loaded || !address
          ? 'Please connect your account to view your movies.'
          : movies.length < 1
          ? 'You have no movies posted yet...'
          : 'Your Movies'}
      </h3>

      {loaded && address && (
        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 h-full item-center ">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              width="w-52 rounded-2xl"
              height="h-96"
            />
          ))}
        </ul>
      )}

      {!loaded && address && (
        <SkeletonTheme
          baseColor="#202020"
          highlightColor="#444"
          borderRadius={15}
        >
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full h-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={400} width={200} />
            ))}
          </ul>
        </SkeletonTheme>
      )}
    </div>
  )
}

export default Page
