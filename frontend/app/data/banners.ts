import { MovieInterface } from '@/utils/interfaces'
import movie1 from '../assets/4.png'
import movie2 from '../assets/5.png'
import movie3 from '../assets/6.png'
import movie4 from '../assets/7.png'
import movie5 from '../assets/8.png'

export const banners: MovieInterface[] = [
  {
    id: 1,
    name: 'Redemption Point',
    image: movie1,
    release: '2024',
    genre: 'Action',
    rating: 'PG-13',
    language: 'English',
    duration: '2h 15m',
    tagline: 'When the past calls, answer with a vengeance',
    background:
      'A cityscape at dusk with a silhouette of a hero in the foreground',
  },
  {
    id: 2,
    name: 'Love in the Time of Sunsets',
    image: movie2,
    release: '2024',
    genre: 'Romantic Comedy',
    rating: 'PG-13',
    language: 'English',
    duration: '1h 45m',
    tagline: 'Find your perfect match in the most unexpected way',
    background: 'A warm, sunny beach with a couple walking hand-in-hand',
  },
  {
    id: 3,
    name: 'The Shadowlands',
    image: movie3,
    release: '2024',
    genre: 'Horror',
    rating: 'R',
    language: 'English',
    duration: '1h 50m',
    tagline: 'Fear what lurks in the darkness',
    background:
      'A haunting, abandoned asylum with creepy shadows and dim lighting',
  },
  {
    id: 4,
    name: 'Galactic Odyssey',
    image: movie4,
    release: '2024',
    genre: 'Science Fiction',
    rating: 'PG-13',
    language: 'English',
    duration: '2h 20m',
    tagline: 'Explore the unknown, discover the unimaginable',
    background: 'A stunning, futuristic spaceship soaring through the cosmos',
  },
  {
    id: 5,
    name: 'The Unseen Path',
    image: movie5,
    release: '2024',
    genre: 'Superhero',
    rating: 'PG-13',
    language: 'English',
    duration: '2h 15m',
    tagline: "Life's journey is full of unexpected twists",
    background:
      'A poignant, black-and-white image of a person standing at a crossroads',
  },
]
