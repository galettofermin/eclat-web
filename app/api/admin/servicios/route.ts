import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { nombre, imagen_url } = await req.json()
  if (!nombre || !imagen_url) {
    return NextResponse.json({ error: 'nombre e imagen_url requeridos' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from('servicios')
    .select('id')
    .eq('nombre', nombre)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('servicios')
      .update({ imagen_url })
      .eq('nombre', nombre)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase
      .from('servicios')
      .insert({ nombre, imagen_url })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
