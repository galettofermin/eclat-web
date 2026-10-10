import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .order('orden')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, imagen_url } = await req.json()
  if (!id || imagen_url === undefined) {
    return NextResponse.json({ error: 'id e imagen_url requeridos' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('servicios')
    .update({ imagen_url })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
