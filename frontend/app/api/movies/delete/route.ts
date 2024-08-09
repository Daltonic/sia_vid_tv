import { apiPost } from '../../database'

export async function POST(req: Request, res: Response) {
  const content = await req.json()

  const requiredProperties = ['userId', 'slug']

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

  const { userId, slug } = content

  const query = `DELETE FROM movies WHERE slug = ? AND userId = ?`

  const values = [slug, userId]

  let status, body

  await apiPost(query, values)
    .then(() => {
      status = 200
      body = { message: 'Successfully deleted movie' }
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
