import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://hgpfezzfyqiecbshuxcn.supabase.co'

export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncGZlenpmeXFpZWNic2h1eGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzMyNDgsImV4cCI6MjA4OTI0OTI0OH0.uFxWrPRQZ5eCwdDy40yXjGs7Kw-3iRwDDebi7VpSmNE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
