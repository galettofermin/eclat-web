/**
 * GET /api/newsletter/desuscribir?id=<suscriptor_id>
 * Desactiva al suscriptor. Se usa desde el link del footer del mail.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (id) {
    // supabase-js no lanza: devuelve { error }. Se ignora para redirigir igual.
    await createAdminClient()
      .from('suscriptores')
      .update({ activo: false })
      .eq('id', id)
  }

  // Redirigir a la página de desuscripción
  return NextResponse.redirect(
    new URL(`/desuscribirse?ok=1`, req.url)
  )
}
