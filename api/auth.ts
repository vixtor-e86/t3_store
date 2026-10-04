// ─── Vercel Serverless Function: /api/auth ──────────────────────────────────
// Validates admin password against environment variable ADMIN_PASSWORD

export const config = {
  runtime: 'nodejs',
}

interface RequestLike {
  method?: string
  body?: any
}

interface ResponseLike {
  status: (code: number) => ResponseLike
  json: (data: any) => void
  setHeader: (name: string, value: string) => void
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const expectedPassword =
    process.env.ADMIN_PASSWORD ||
    process.env.VITE_ADMIN_PASSWORD ||
    'Temitope2023'

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      // Keep as string
    }
  }

  const inputPassword = body?.password || ''

  if (inputPassword === expectedPassword) {
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ success: false, error: 'Incorrect password' })
  }
}
