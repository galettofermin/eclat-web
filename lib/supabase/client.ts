import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = 'https://fwdhtdpzxvvjattbllfl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_xnvX6Ov1Y8DYUY8-AAcEsQ_4CBr36CB'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
  )
}
