import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? 'NO DEFINIDA'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NO DEFINIDA'
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'NO DEFINIDA'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'NO DEFINIDA'

  return NextResponse.json({
    supabase_url: supabaseUrl,
    anon_key_starts_with: anonKey.slice(0, 15) + '...',
    mp_token_starts_with: mpToken.slice(0, 15) + '...',
    site_url: siteUrl,
  })
}
