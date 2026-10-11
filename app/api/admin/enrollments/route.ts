import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

// POST: habilitar un curso a un alumno (inscripción manual, ya aprobada)
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { userId, courseId } = await req.json()
  if (!userId || !courseId) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const admin = createAdminClient()
  const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)
  if (userError || !user) return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })

  const approved = { status: 'approved', approved_at: new Date().toISOString() }

  // Si ya existe una inscripción (p. ej. pendiente de pago) se aprueba en vez de duplicarla
  const { data: existing } = await admin
    .from('enrollments').select('id').eq('user_id', userId).eq('course_id', courseId).maybeSingle()

  const { error } = existing
    ? await admin.from('enrollments').update(approved).eq('id', existing.id)
    : await admin.from('enrollments').insert({
        user_id: userId, course_id: courseId, user_email: user.email,
        payment_method: 'manual', amount: 0, ...approved,
      })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: revocar el acceso (borra la inscripción)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { enrollmentId } = await req.json()
  if (!enrollmentId) return NextResponse.json({ error: 'Falta enrollmentId' }, { status: 400 })

  const { error } = await createAdminClient().from('enrollments').delete().eq('id', enrollmentId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
