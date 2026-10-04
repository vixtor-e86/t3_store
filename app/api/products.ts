// ─── Vercel Serverless Function: /api/products ──────────────────────────────
// Supports:
// 1. Vercel Blob (BLOB_READ_WRITE_TOKEN) - 1-click in Vercel Storage
// 2. Upstash Redis / Vercel KV (KV_REST_API_URL / UPSTASH_REDIS_REST_URL)
// 3. Fallback to local browser storage if neither is configured yet.

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

const STORAGE_KEY = 't3_drinks_catalog'

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

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  // ─── 1. Handling GET: Read drinks from Vercel Blob or KV ─────────
  if (req.method === 'GET') {
    // A. Check Vercel Blob first
    if (blobToken) {
      try {
        const { list } = await import('@vercel/blob')
        const { blobs } = await list({ prefix: `${STORAGE_KEY}.json` })
        if (blobs && blobs.length > 0) {
          const fetchRes = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: 'no-store' })
          if (fetchRes.ok) {
            const data = await fetchRes.json()
            res.status(200).json(data)
            return
          }
        }
      } catch (err) {
        console.error('Error reading from Vercel Blob:', err)
      }
    }

    // B. Check KV / Upstash Redis
    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/get/${STORAGE_KEY}`, {
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

  // ─── 2. Handling POST/PUT: Save drinks list to Vercel Blob or KV ─────────────────
  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

    // A. Save to Vercel Blob if connected
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`${STORAGE_KEY}.json`, payload, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
        })
        res.status(200).json({ success: true, storage: 'blob', url: blob.url })
        return
      } catch (err) {
        console.error('Error saving to Vercel Blob:', err)
        res.status(500).json({ error: 'Failed to save to Vercel Blob' })
        return
      }
    }

    // B. Save to KV / Upstash Redis if connected
    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/set/${STORAGE_KEY}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        res.status(200).json({ success: true, storage: 'kv', kvResponse: data })
        return
      } catch (err) {
        console.error('Error saving to Vercel KV:', err)
        res.status(500).json({ error: 'Failed to save to database' })
        return
      }
    }

    // Acknowledged even if DB not yet connected (localStorage keeps local copy)
    res.status(200).json({ success: true, note: 'Saved locally; connect Vercel Blob or KV for global sync' })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
