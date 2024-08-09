import crypto from 'crypto'
import { apiPost } from '../../database'

export async function POST(req: Request, res: Response) {
  const content = await req.json()

  const requiredProperties = [
    'userId',
    'name',
    'image',
    'videoUrl',
    'release',
    'genre',
    'rating',
    'language',
    'duration',
    'background',
  ]

  const missingProperty = requiredProperties.find(
    (property) => !(property in content)
  )

  if (missingProperty) {
    return Response.json(
      {
        error: `Missing required property: ${missingProperty}`,
      },
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    )
  }

  const {
    userId,
    name,
    image,
    videoUrl,
    release,
    genre,
    rating,
    language,
    duration,
    background,
  } = content

  const randomString = crypto.randomBytes(3).toString('hex').toLowerCase()
  const slug = `${name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s/g, '-')
    .split('-')
    .join('-')}-${randomString}`.toLowerCase()

  const query = `
    INSERT INTO movies(userId, name, image, videoUrl, slug, release, genre, rating, language, duration, background)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const values = [
    userId,
    name,
    image,
    videoUrl,
    slug,
    release,
    genre,
    rating,
    language,
    duration,
    background,
  ]

  let status, body

  await apiPost(query, values)
    .then(() => {
      status = 201
      body = { message: 'Successfully created movie' }
    })
    .catch((err) => {
      status = 400
      body = err
    })

  return Response.json(body, {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
