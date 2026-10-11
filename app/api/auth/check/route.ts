import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data: { user } } = await createClient().auth.getUser()
    return NextResponse.json({ loggedIn: !!user, isAdmin: user?.email === DIRECTOR_EMAIL })
  } catch {
    return NextResponse.json({ loggedIn: false, isAdmin: false })
  }
}
