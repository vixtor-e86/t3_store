// ─── Vercel Serverless Function: /api/products ──────────────────────────────
// Primary Database: Supabase PostgreSQL (Table: t3_drinks)
// Fallbacks: Vercel Blob, KV, and Local Storage

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

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://hgpfezzfyqiecbshuxcn.supabase.co'

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncGZlenpmeXFpZWNic2h1eGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzMyNDgsImV4cCI6MjA4OTI0OTI0OH0.uFxWrPRQZ5eCwdDy40yXjGs7Kw-3iRwDDebi7VpSmNE'

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

  const isCheckMode =
    Boolean(req.query?.check || req.query?.status) ||
    Boolean(req.url && (req.url.includes('check=1') || req.url.includes('status=1')))

  // ─── 0. Diagnostics Check Endpoint: /api/products?check=1 ───────────────────
  if (isCheckMode) {
    let supabaseStatus = 'disconnected'
    let supabaseError: string | null = null

    try {
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/t3_drinks?select=id&limit=1`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })
      if (checkRes.ok) {
        supabaseStatus = 'connected'
      } else {
        const errJson = await checkRes.json().catch(() => ({}))
        supabaseError = errJson?.message || `HTTP ${checkRes.status}`
        if (checkRes.status === 404 || supabaseError?.includes('PGRST205')) {
          supabaseStatus = 'table_missing'
        }
      }
    } catch (err: any) {
      supabaseError = err?.message || String(err)
    }

    res.status(200).json({
      status: 'ok',
      storage: supabaseStatus === 'connected' ? 'supabase' : 'local_only',
      supabase: {
        configured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
        status: supabaseStatus,
        error: supabaseError,
      },
      timestamp: Date.now(),
    })
    return
  }

  // ─── 1. Handling GET: Read drinks from Supabase PostgreSQL ───────────────────
  if (req.method === 'GET') {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const fetchRes = await fetch(`${SUPABASE_URL}/rest/v1/t3_drinks?select=*&order=sort_order.asc`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        })
        if (fetchRes.ok) {
          const rows = await fetchRes.json()
          if (Array.isArray(rows) && rows.length > 0) {
            const formatted = rows.map((r: any) => ({
              id: r.id,
              name: r.name,
              size: r.size,
              price: Number(r.price) || 0,
              category: r.category || 'PET Bottles',
              image: r.image || undefined,
              isAvailable: r.is_available !== false,
            }))
            res.status(200).json(formatted)
            return
          }
        }
      } catch (err) {
        console.error('Error reading from Supabase:', err)
      }
    }

    // Return empty array with 200 so frontend falls back to default drinks safely
    res.status(200).json([])
    return
  }

  // ─── 2. Handling POST/PUT: Save drinks list to Supabase PostgreSQL ───────────
  if (req.method === 'POST' || req.method === 'PUT') {
    let items: any[] = []
    const rawBody = req.body

    if (typeof rawBody === 'string') {
      try {
        const parsed = JSON.parse(rawBody)
        if (Array.isArray(parsed)) items = parsed
      } catch {
        // invalid JSON
      }
    } else if (Array.isArray(rawBody)) {
      items = rawBody
    }

    // Save to Supabase
    if (SUPABASE_URL && SUPABASE_ANON_KEY && items.length > 0) {
      try {
        const rows = items.map((item, index) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          price: Number(item.price) || 0,
          category: item.category || 'PET Bottles',
          image: item.image || null,
          is_available: item.isAvailable !== false,
          sort_order: index,
          updated_at: new Date().toISOString(),
        }))

        const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/t3_drinks`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify(rows),
        })

        if (upsertRes.ok) {
          res.status(200).json({
            success: true,
            storage: 'supabase',
            itemCount: items.length,
            message: 'Saved to Supabase database successfully. All devices will see updated prices instantly!',
          })
          return
        } else {
          const errData = await upsertRes.json().catch(() => ({}))
          console.error('Supabase save error:', errData)
          res.status(200).json({
            success: false,
            storage: 'none',
            error: errData?.message || 'Failed saving to Supabase table',
            hint: 'Please ensure you created the t3_drinks table in Supabase SQL Editor.',
          })
          return
        }
      } catch (err: any) {
        console.error('Error saving to Supabase:', err)
        res.status(500).json({
          success: false,
          error: 'Failed to save to database: ' + (err?.message || String(err)),
        })
        return
      }
    }

    res.status(200).json({
      success: false,
      storage: 'none',
      warning: 'No items or Supabase not reachable. Saved locally in browser.',
    })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
