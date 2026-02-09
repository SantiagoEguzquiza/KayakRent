import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient(): ReturnType<typeof createSupabaseBrowserClient> | null {
  if (typeof window === 'undefined') {
    return null
  }
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}
