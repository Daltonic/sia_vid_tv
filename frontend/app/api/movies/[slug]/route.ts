import { apiGet } from '../../database'

export async function GET(
  req: Request,
  { params }: { params: any },
  res: Response
): Promise<Response> {
  const slug = params.slug

  if (!slug) {
    // Create a Response object with the error status and body
    return new Response(JSON.stringify({ error: 'slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const query = `SELECT * FROM movies WHERE slug = "${slug}"`

  let status, body
  try {
    const result = await apiGet(query)
    status = 200
    body = result
  } catch (err: any) {
    status = 400
    body = { error: err }
  }

  // Return a Response object with the final status and body
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
