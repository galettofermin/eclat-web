/**
 * POST /api/newsletter/suscribir
 * Agrega un usuario a la tabla suscriptores.
 * Se llama automáticamente al registrarse.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email, nombre } = await req.json()
    if (!email) return NextResponse.json({ ok: true })

    await createAdminClient()
      .from('suscriptores')
      .upsert(
        { email, nombre: nombre || null, lista: 'general', activo: true },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
