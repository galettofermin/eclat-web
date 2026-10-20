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

/* ── Agregar suscriptor manual ── */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { nombre, email, lista } = await req.json()
  if (!email?.trim()) return NextResponse.json({ error: 'El email es requerido' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('suscriptores')
    .insert({ nombre: nombre?.trim() || null, email: email.trim().toLowerCase(), lista: lista ?? 'general', activo: true })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

/* ── Editar lista de un suscriptor ── */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, lista } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('suscriptores').update({ lista }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/* ── Eliminar (desactivar) suscriptor ── */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('suscriptores').update({ activo: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
