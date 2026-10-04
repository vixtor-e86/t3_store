// ─── Vercel Serverless Function: /api/products ──────────────────────────────
// Supports:
// 1. Vercel Blob (BLOB_READ_WRITE_TOKEN) - 1-click in Vercel Storage
// 2. Upstash Redis / Vercel KV (KV_REST_API_URL / UPSTASH_REDIS_REST_URL)
// 3. Fallback reporting if neither is configured in Vercel environment.

export const config = {
  runtime: 'nodejs',
}

interface RequestLike {
  method?: string
  body?: any
  query?: Record<string, string | string[]>
  url?: string
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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  const isCheckMode =
    Boolean(req.query?.check || req.query?.status) ||
    Boolean(req.url && (req.url.includes('check=1') || req.url.includes('status=1')))

  // ─── 0. Diagnostics Check Endpoint: /api/products?check=1 ───────────────────
  if (isCheckMode) {
    let blobLive = false
    let blobError: string | null = null

    if (blobToken) {
      try {
        const { list } = await import('@vercel/blob')
        await list({ prefix: `${STORAGE_KEY}.json`, token: blobToken })
        blobLive = true
      } catch (err: any) {
        blobError = err?.message || String(err)
      }
    }

    res.status(200).json({
      status: 'ok',
      storage: blobLive ? 'blob' : blobToken ? 'blob_error' : kvUrl ? 'kv' : 'none',
      blob: {
        configured: Boolean(blobToken),
        connected: blobLive,
        error: blobError,
      },
      kv: {
        configured: Boolean(kvUrl && kvToken),
      },
      timestamp: Date.now(),
    })
    return
  }

  // ─── 1. Handling GET: Read drinks from Vercel Blob or KV ─────────────────────
  if (req.method === 'GET') {
    // A. Check Vercel Blob first
    if (blobToken) {
      try {
        const { list } = await import('@vercel/blob')
        const { blobs } = await list({ prefix: `${STORAGE_KEY}.json`, token: blobToken })
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

    // Return empty array with 200 so frontend falls back to default drinks safely
    res.status(200).json([])
    return
  }

  // ─── 2. Handling POST/PUT: Save drinks list to Vercel Blob or KV ───────────────
  if (req.method === 'POST' || req.method === 'PUT') {
    const rawBody = req.body
    let payload = ''
    let itemCount = 0

    if (typeof rawBody === 'string') {
      payload = rawBody
      try {
        const parsed = JSON.parse(rawBody)
        if (Array.isArray(parsed)) itemCount = parsed.length
      } catch {
        // keep string
      }
    } else {
      payload = JSON.stringify(rawBody)
      if (Array.isArray(rawBody)) itemCount = rawBody.length
    }

    // A. Save to Vercel Blob if connected
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`${STORAGE_KEY}.json`, payload, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          token: blobToken,
        })
        res.status(200).json({
          success: true,
          storage: 'blob',
          itemCount,
          url: blob.url,
          message: 'Saved to Vercel Blob successfully. All devices will see updated prices!',
        })
        return
      } catch (err: any) {
        console.error('Error saving to Vercel Blob:', err)
        res.status(500).json({
          success: false,
          error: 'Failed to save to Vercel Blob: ' + (err?.message || String(err)),
        })
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
        res.status(200).json({
          success: true,
          storage: 'kv',
          itemCount,
          kvResponse: data,
          message: 'Saved to Vercel KV successfully. All devices will see updated prices!',
        })
        return
      } catch (err: any) {
        console.error('Error saving to Vercel KV:', err)
        res.status(500).json({
          success: false,
          error: 'Failed to save to database: ' + (err?.message || String(err)),
        })
        return
      }
    }

    // Neither Vercel Blob nor KV is connected in Vercel environment!
    // Respond with success: false and clear notification so Admin UI warns the user
    res.status(200).json({
      success: false,
      storage: 'none',
      warning:
        'Vercel Blob is not connected yet in your Vercel Project Settings. Price was saved ONLY on this laptop. Connect your Blob store to sync with mobile phones.',
    })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
