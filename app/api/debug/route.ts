import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NO DEFINIDA',
    anon_key_prefix: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'NO DEFINIDA').slice(0, 20) + '...',
  })
}
