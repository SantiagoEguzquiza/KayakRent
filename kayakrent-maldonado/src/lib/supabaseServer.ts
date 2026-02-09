import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con service role key.
 * Solo usar en el servidor (API routes, Server Components).
 * Permite bypass de RLS (p. ej. actualizar stock en kayak_types).
 * Configurar SUPABASE_SERVICE_ROLE_KEY en .env.local.
 */
let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return supabaseAdmin
}
