import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nombre, descripcion } = await req.json()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('servicios')
    .update({ nombre, descripcion })
    .eq('id', Number(params.id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
