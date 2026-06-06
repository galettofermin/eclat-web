import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isAdmin = user?.email === DIRECTOR_EMAIL
    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
