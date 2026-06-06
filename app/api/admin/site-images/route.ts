import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const keys = searchParams.get('keys')?.split(',').filter(Boolean) ?? []
  if (!keys.length) return NextResponse.json([])

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('site_images')
    .select('key, url')
    .in('key', keys)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { key, url } = await req.json()
  if (!key || !url) return NextResponse.json({ error: 'key y url requeridos' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_images')
    .upsert({ key, url, updated_at: new Date().toISOString() })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
