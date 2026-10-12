import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'
import { findUserByEmail } from '@/lib/auth/findUsersByEmail'

export const dynamic = 'force-dynamic'

async function parse(req: Request) {
  const { email, course_id } = await req.json().catch(() => ({}))
  return typeof email === 'string' && typeof course_id === 'string' && email && course_id
    ? { email, course_id } : null
}

// POST: habilita el curso al alumno con ese email (crea o aprueba su inscripción)
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await parse(req)
  if (!body) return NextResponse.json({ error: 'Faltan email o course_id' }, { status: 400 })

  const admin = createAdminClient()
  const user = await findUserByEmail(admin, body.email)
  if (!user) return NextResponse.json({ error: 'Ese mail no tiene una cuenta registrada.' }, { status: 404 })

  const approved = { status: 'approved', approved_at: new Date().toISOString() }
  const { data: existing } = await admin
    .from('enrollments').select('id').eq('user_id', user.id).eq('course_id', body.course_id).maybeSingle()

  // enrollments no tiene restricción única (user_id, course_id): se actualiza o se inserta a mano
  const { error } = existing
    ? await admin.from('enrollments').update(approved).eq('id', existing.id)
    : await admin.from('enrollments').insert({
        user_id: user.id, course_id: body.course_id, user_email: user.email,
        payment_method: 'manual', amount: 0, ...approved,
      })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: revoca el acceso (borra la inscripción del alumno a ese curso)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await parse(req)
  if (!body) return NextResponse.json({ error: 'Faltan email o course_id' }, { status: 400 })

  const admin = createAdminClient()
  const user = await findUserByEmail(admin, body.email)
  if (!user) return NextResponse.json({ error: 'Ese mail no tiene una cuenta registrada.' }, { status: 404 })

  const { error } = await admin.from('enrollments').delete().eq('user_id', user.id).eq('course_id', body.course_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
