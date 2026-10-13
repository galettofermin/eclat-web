import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const lista = searchParams.get('lista')

  const admin = createAdminClient()
  let q = admin.from('suscriptores').select('*').eq('activo', true).order('creado_en', { ascending: false })
  if (lista && lista !== 'todos') q = q.eq('lista', lista)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
