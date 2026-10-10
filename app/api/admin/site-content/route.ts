import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value')
    .order('key')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const items: { key: string; value: string }[] = await req.json()
  if (!Array.isArray(items)) return NextResponse.json({ error: 'Array requerido' }, { status: 400 })
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_content')
    .upsert(
      items.map(i => ({ key: i.key, value: i.value, updated_at: new Date().toISOString() })),
      { onConflict: 'key' },
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
