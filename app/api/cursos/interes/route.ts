/**
 * POST /api/cursos/interes
 * Registra que un usuario logueado visitó la página de un curso sin comprarlo.
 * Si en 24hs no compró, el cron job le manda un mail de seguimiento.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json()
    if (!courseId) return NextResponse.json({ ok: true })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: true }) // solo usuarios registrados

    const admin = createAdminClient()

    // Si ya está inscripto, no hacemos nada
    const { data: enrollment } = await admin
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()
    if (enrollment) return NextResponse.json({ ok: true })

    // Guardamos/actualizamos el interés — send_after = ahora + 24hs
    const sendAfter = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    await admin.from('course_interest').upsert(
      {
        user_id: user.id,
        course_id: courseId,
        user_email: user.email,
        send_after: sendAfter,
        sent: false,
      },
      { onConflict: 'user_id,course_id' }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
