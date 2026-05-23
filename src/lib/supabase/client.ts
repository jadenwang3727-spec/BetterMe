import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: ReturnType<typeof createBrowserClient<any>> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): ReturnType<typeof createBrowserClient<any>> {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  // During build with placeholder env vars, skip client creation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!url.startsWith('http')) return null as unknown as ReturnType<typeof createBrowserClient<any>>
  client = createBrowserClient(url, key)
  return client
}
