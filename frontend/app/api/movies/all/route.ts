import { apiGet } from '../../database'

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url)
  const pageSizeParam = url.searchParams.get('pageSize')
  const userIdParam = url.searchParams.get('userId')

  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : null
  const userId = userIdParam ? userIdParam : null
  

  let query = `SELECT * FROM movies`
  if (userId !== null) {
    query += ` WHERE userId="${userId}"`
  }

  if (pageSize !== null) {
    query += ` LIMIT ${pageSize}`
  }

  let status, body
  try {
    await apiGet(query)
      .then((res) => {
        status = 200
        body = res
      })
      .catch((err: Error) => {
        status = 400
        body = { error: err }
      })
    return Response.json(body, {
      status,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error.message)
    return Response.json(
      { error: error },
      {
        status: 400,
      }
    )
  }
}
