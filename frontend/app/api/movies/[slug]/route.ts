import { apiGet } from '../../database'

export async function GET(
  req: Request,
  { params }: { params: any },
  res: Response
) {
  const slug = params.slug
  if (!slug) {
    return Response.json(
      { error: 'slug is required' },
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    )
  }

  const query = `SELECT * FROM movies WHERE slug = "${slug}"`

  let status, body

  await apiGet(query)
    .then((res) => {
      status = 200
      body = res
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
