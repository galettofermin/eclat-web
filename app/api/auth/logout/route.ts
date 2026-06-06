import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const supabase = createClient()
  await supabase.auth.signOut()
  const origin = new URL(req.url).origin
  const res = NextResponse.redirect(new URL('/', origin))
  res.cookies.delete('eclat-admin')
  return res
}
