import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'
import { usersByEmail } from '@/lib/auth/findUsersByEmail'

export const dynamic = 'force-dynamic'

// GET: solicitudes con el estado de acceso de cada una (si tiene cuenta y si ya está habilitada)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const [{ data: registrations, error }, { data: enrollments }, users] = await Promise.all([
    admin.from('course_registrations').select('*').order('created_at', { ascending: false }),
    admin.from('enrollments').select('user_id, course_id').eq('status', 'approved'),
    usersByEmail(admin),
  ])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const approved = new Set((enrollments ?? []).map(e => `${e.user_id}:${e.course_id}`))
  const result = (registrations ?? []).map(r => {
    const user = users.get(String(r.email).trim().toLowerCase())
    return {
      ...r,
      has_account: !!user,
      has_access: !!user && approved.has(`${user.id}:${r.course_id}`),
    }
  })

  return NextResponse.json({ registrations: result })
}

// DELETE: borra una solicitud (no toca el acceso al curso)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await req.json().catch(() => ({}))
  if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  const { error } = await createAdminClient().from('course_registrations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
