/**
 * POST /api/admin/formacion/email
 * Envía la propuesta de un curso a todos los suscriptores activos.
 * Incluye artículos recientes publicados al final del email.
 * Opcionalmente suscribe y notifica emails extra.
 * Solo accesible para el director.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailCurso from '@/emails/EmailCurso'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://eclatcentro.com'

export async function POST(req: Request) {
  try {
    const { data: { user } } = await createClient().auth.getUser()
    if (user?.email !== DIRECTOR_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { courseId, asunto, introExtra, emailsExtra = [] } = await req.json()

    if (!courseId) {
      return NextResponse.json({ error: 'courseId requerido' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Traer el curso
    const { data: course, error: courseErr } = await admin
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseErr || !course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    // Traer artículos recientes publicados (hasta 3)
    const { data: articulosData } = await admin
      .from('articles')
      .select('id, title, excerpt, category, image_url')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
    const articulos = articulosData ?? []

    // Suscribir emails extra
    const extrasNormalizados: string[] = []
    for (const email of emailsExtra) {
      const e = email.trim().toLowerCase()
      if (!e) continue
      extrasNormalizados.push(e)
      await admin.from('suscriptores').upsert(
        { email: e, activo: true },
        { onConflict: 'email', ignoreDuplicates: false }
      )
    }

    // Traer todos los suscriptores activos
    const { data: suscriptores } = await admin
      .from('suscriptores')
      .select('id, email, nombre')
      .eq('activo', true)

    if (!suscriptores?.length) {
      return NextResponse.json({ error: 'No hay suscriptores activos' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    let enviados = 0
    let errores = 0

    const asuntoFinal = asunto?.trim() || `Nueva formación disponible: ${course.title}`

    for (const suscriptor of suscriptores) {
      try {
        const unsubscribeUrl = `${SITE_URL}/desuscribirse?id=${suscriptor.id}`

        const html = await render(EmailCurso({
          asunto: asuntoFinal,
          curso: course,
          introExtra: introExtra?.trim() || undefined,
          articulos,
          unsubscribeUrl,
          siteUrl: SITE_URL,
          nombreDestinatario: suscriptor.nombre || undefined,
        }))

        await resend.emails.send({
          from: 'ÉCLAT <hola@eclatcentro.com>',
          to: suscriptor.email,
          subject: asuntoFinal,
          html,
        })
        enviados++
      } catch (err) {
        console.error(`Error enviando a ${suscriptor.email}:`, err)
        errores++
      }

      await new Promise(r => setTimeout(r, 100))
    }

    return NextResponse.json({
      ok: true,
      enviados,
      errores,
      extrasAgregados: extrasNormalizados.length,
    })
  } catch (error) {
    console.error('Formacion email error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
