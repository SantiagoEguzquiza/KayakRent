import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient() must be called in the browser')
  }
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}
