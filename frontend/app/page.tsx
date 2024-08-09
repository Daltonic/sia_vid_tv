'use client'
import React, { useEffect, useState } from 'react'
import Banners from '@/app/components/home/Banners'
import Posters from '@/app/components/home/Posters'
import Subscriptions from '@/app/components/home/Subscriptions'
import { PosterInterface } from '@/utils/interfaces'
import PostersUI from './components/home/PostersUI'
import { fetchMovies } from './services/api.service'

const Page = () => {
  const [movies, setMovies] = useState<PosterInterface[]>([])
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchMoviesData = async () => {
      const moviesData = await fetchMovies()
      setMovies(moviesData)
      setLoaded(true)
    }

    fetchMoviesData()
  }, [])

  return (
    <>
      <Banners />
      {loaded ? <Posters movies={movies} /> : <PostersUI posters={3} />}
      <Subscriptions />
    </>
  )
}

export default Page
