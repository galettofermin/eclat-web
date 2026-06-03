import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { DIRECTOR_EMAIL } from '@/lib/constants'

// GET: listar todos los usuarios
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.email !== DIRECTOR_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const admin = createAdminClient()
  const { data: { users }, error } = await admin.auth.admin.listUsers({ perPage: 1000 })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Filtrar al propio director de la lista
  const filtered = users.filter((u) => u.email !== DIRECTOR_EMAIL)

  // Para cada usuario buscar sus inscripciones
  const { data: enrollments } = await admin
    .from('enrollments')
    .select('user_id, status, courses(title)')

  const enrollmentMap: Record<string, { title: string; status: string }[]> = {}
  enrollments?.forEach((enr: any) => {
    if (!enrollmentMap[enr.user_id]) enrollmentMap[enr.user_id] = []
    if (enr.courses) enrollmentMap[enr.user_id].push({ title: enr.courses.title, status: enr.status })
  })

  const result = filtered.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    name: u.user_metadata?.full_name ?? '',
    created_at: u.created_at,
    courses: enrollmentMap[u.id] ?? [],
  }))

  return NextResponse.json({ users: result })
}

// DELETE: eliminar un usuario
export async function DELETE(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.email !== DIRECTOR_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Falta userId' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
