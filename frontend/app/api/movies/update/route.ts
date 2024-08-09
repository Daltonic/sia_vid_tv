import { apiPost } from '../../database'

export async function POST(req: Request, res: Response) {
  const content = await req.json()

  const requiredProperties = [
    'userId',
    'slug',
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
    slug,
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

  const query = `
        UPDATE movies
        SET name = ?, image = ?, videoUrl = ?, release = ?, genre = ?, rating = ?, language = ?, duration = ?, background = ?
        WHERE slug = ? AND userId = ?
    `

  const values = [
    name,
    image,
    videoUrl,
    release,
    genre,
    rating,
    language,
    duration,
    background,
    slug,
    userId,
  ]

  let status, body

  await apiPost(query, values)
    .then(() => {
      status = 200
      body = { message: 'Successfully updated movie' }
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
