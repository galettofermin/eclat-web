import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ isAdmin: await isAdmin() })
}
