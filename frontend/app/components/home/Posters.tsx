'use client'
import React from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper'
import MovieCard from '../shared/MovieCard'
import { PosterInterface } from '@/utils/interfaces'

const Posters = ({ movies }: { movies: PosterInterface[] }) => {
  return (
    <div className="mt-10 lg:mt-20">
      <h1 className="text-white text-xl lg:text-3xl font-semibold text-center mb-5">
        {movies.length > 0 ? 'Hot New' : 'No Movies Yet...'}
      </h1>

      <div className="carousel-container">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-2/3 overflow-hidden"
          breakpoints={{
            450: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
        >
          {movies.length > 0 &&
            movies.map((movie: PosterInterface, i: number) => (
              <SwiperSlide key={i}>
                <MovieCard
                  width="w-52 rounded-2xl"
                  key={movie.id}
                  movie={movie}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Posters
