import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarNuevaInscripcion } from '@/lib/email'
import { REGISTRATION_ROLES } from '@/lib/registrationRoles'

export const dynamic = 'force-dynamic'

const REQUIRED = ['nombre', 'apellido', 'email', 'telefono', 'localidad'] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }) }

  // Honeypot: los bots completan el campo oculto; se responde ok sin guardar nada
  if (body.website) return NextResponse.json({ ok: true })

  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, 200) : '')
  const data = Object.fromEntries(REQUIRED.map(k => [k, str(k)])) as Record<(typeof REQUIRED)[number], string>

  if (REQUIRED.some(k => !data[k])) return NextResponse.json({ error: 'Completá todos los campos obligatorios.' }, { status: 400 })
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

  // La inscripción ya quedó guardada: si el mail falla no se le muestra error al usuario
  try {
    const { error: mailError } = await enviarNuevaInscripcion({ courseTitle: course.title, ...data, rol })
    if (mailError) console.error('Aviso de inscripción por mail:', mailError)
  } catch (e) {
    console.error('Aviso de inscripción por mail:', e)
  }

  return NextResponse.json({ ok: true })
}
