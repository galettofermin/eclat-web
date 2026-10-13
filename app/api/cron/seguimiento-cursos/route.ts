/**
 * GET /api/cron/seguimiento-cursos
 * Cron job — se ejecuta cada hora (Vercel Cron).
 * Envía el mail de seguimiento a usuarios que visitaron un curso
 * hace más de 24hs y todavía no compraron.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarSeguimientoCurso } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Verificar que viene de Vercel Cron (o de nosotros con el secret)
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  // Buscar intereses pendientes de enviar cuyo send_after ya pasó
  const { data: pendientes } = await admin
    .from('course_interest')
    .select('id, user_id, course_id, user_email')
    .eq('sent', false)
    .lte('send_after', now)
    .limit(50)

  if (!pendientes?.length) return NextResponse.json({ ok: true, enviados: 0 })

  let enviados = 0

  for (const item of pendientes) {
    try {
      // Verificar que todavía no compró
      const { data: enrollment } = await admin
        .from('enrollments')
        .select('id')
        .eq('user_id', item.user_id)
        .eq('course_id', item.course_id)
        .maybeSingle()

      // Marcar como sent siempre (compró o no) para no volver a procesar
      await admin.from('course_interest')
        .update({ sent: true })
        .eq('id', item.id)

      if (enrollment) continue // ya compró, no mandar mail

      // Obtener datos del curso y del usuario
      const [{ data: course }, { data: { user: authUser } }] = await Promise.all([
        admin.from('courses').select('title, description').eq('id', item.course_id).single(),
        admin.auth.admin.getUserById(item.user_id),
      ])

      if (!course || !item.user_email) continue

      const meta = authUser?.user_metadata ?? {}
      const nombre = meta.nombre || String(meta.full_name ?? '').trim().split(/\s+/)[0] || item.user_email.split('@')[0]

      const siteUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

      await enviarSeguimientoCurso({
        email: item.user_email,
        nombre,
        tituloCurso: course.title,
        urlCurso: `${siteUrl}/cursos/${item.course_id}`,
        descripcionCurso: course.description ?? undefined,
      })

      enviados++
    } catch (err) {
      console.error('Seguimiento curso error:', err)
    }
  }

  return NextResponse.json({ ok: true, enviados })
}
