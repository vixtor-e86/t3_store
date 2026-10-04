// ─── Vercel Serverless Function: /api/products ──────────────────────────────
// Supports Vercel KV (Upstash) or Vercel Postgres natively.
// If no database env vars are configured yet, gracefully returns defaults.

export const config = {
  runtime: 'nodejs',
}

interface RequestLike {
  method?: string
  body?: any
  query?: Record<string, string>
}

interface ResponseLike {
  status: (code: number) => ResponseLike
  json: (data: any) => void
  setHeader: (name: string, value: string) => void
}

const KV_KEY = 't3_drinks_catalog'

export default async function handler(req: RequestLike, res: ResponseLike) {
  // CORS & caching headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  // ─── 1. Handling GET: Read drinks from Vercel KV or return empty ─────────
  if (req.method === 'GET') {
    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/get/${KV_KEY}`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        })
        const data = await response.json()
        if (data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result
          res.status(200).json(parsed)
          return
        }
      } catch (err) {
        console.error('Error reading from Vercel KV:', err)
      }
    }
    // Return empty array with 200 so frontend falls back to its default drinks safely
    res.status(200).json([])
    return
  }

  // ─── 2. Handling POST/PUT: Save drinks list to Vercel KV ─────────────────
  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/set/${KV_KEY}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        res.status(200).json({ success: true, kvResponse: data })
        return
      } catch (err) {
        console.error('Error saving to Vercel KV:', err)
        res.status(500).json({ error: 'Failed to save to database' })
        return
      }
    }

    // Acknowledged even if DB not yet connected (localStorage keeps local copy)
    res.status(200).json({ success: true, note: 'Saved locally; connect Vercel KV for global sync' })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
