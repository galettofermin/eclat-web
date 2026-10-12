import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { enviarNuevaInscripcion, enviarConfirmacionInscripcion } from '@/lib/email'
import { REGISTRATION_ROLES } from '@/lib/registrationRoles'

export const dynamic = 'force-dynamic'

const REQUIRED = ['nombre', 'apellido', 'email', 'telefono', 'localidad'] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }) }

  // Honeypot: los bots completan el campo oculto; se responde ok sin guardar nada
  if (body.website) return NextResponse.json({ ok: true })

  // Solo se leen los campos de la lista: si llega una contraseña en el body, se ignora y no se guarda
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, 200) : '')
  const data = Object.fromEntries(REQUIRED.map(k => [k, str(k)])) as Record<(typeof REQUIRED)[number], string>

  // Alumno con sesión que se inscribe sin el formulario: nombre y apellido salen de su cuenta,
  // teléfono y localidad quedan vacíos. Solo vale para el mail de la sesión.
  if (REQUIRED.some(k => !data[k])) {
    const { data: { user } } = await createClient().auth.getUser()
    if (user?.email && user.email.toLowerCase() === data.email.toLowerCase()) {
      const meta = user.user_metadata ?? {}
      const [first = '', ...rest] = String(meta.full_name ?? '').trim().split(/\s+/)
      data.nombre ||= String(meta.nombre || first || user.email.split('@')[0]).slice(0, 200)
      data.apellido ||= String(meta.apellido || rest.join(' ') || '-').slice(0, 200)
      data.email = user.email
      data.telefono ||= ''
      data.localidad ||= ''
    } else {
      return NextResponse.json({ error: 'Completá todos los campos obligatorios.' }, { status: 400 })
    }
  }
  if (!data.nombre || !data.apellido) return NextResponse.json({ error: 'Completá todos los campos obligatorios.' }, { status: 400 })
  if (!EMAIL_RE.test(data.email)) return NextResponse.json({ error: 'El mail no es válido.' }, { status: 400 })
  const rol = (REGISTRATION_ROLES as readonly string[]).includes(str('rol')) ? str('rol') : ''

  // El título sale de la base, no del navegador
  const admin = createAdminClient()
  const { data: course } = await admin
    .from('courses').select('id, title').eq('id', str('courseId')).eq('published', true).maybeSingle()
  if (!course) return NextResponse.json({ error: 'El curso no está disponible.' }, { status: 400 })

  const { error } = await admin.from('course_registrations').insert({
    course_id: course.id, course_title: course.title, ...data, rol,
  })
  if (error) {
    console.error('course_registrations insert:', error)
    return NextResponse.json({ error: 'No pudimos guardar la inscripción. Probá de nuevo o escribinos por WhatsApp.' }, { status: 500 })
  }

  // La inscripción ya quedó guardada: si algún mail falla no se le muestra error al usuario
  const mails = await Promise.allSettled([
    enviarNuevaInscripcion({ courseTitle: course.title, ...data, rol }),
    enviarConfirmacionInscripcion({ email: data.email, nombre: data.nombre, courseTitle: course.title }),
  ])
  mails.forEach((m, i) => {
    const err = m.status === 'rejected' ? m.reason : m.value.error
    if (err) console.error(i === 0 ? 'Aviso de inscripción al admin:' : 'Confirmación al alumno:', err)
  })

  return NextResponse.json({ ok: true })
}
