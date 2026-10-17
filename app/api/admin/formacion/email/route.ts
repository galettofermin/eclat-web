/**
 * POST /api/admin/formacion/email
 * Envía la propuesta de un curso a todos los suscriptores activos.
 * Opcionalmente suscribe y notifica emails extra indicados por el director.
 * Solo accesible para el director.
 *
 * Body: {
 *   courseId: string
 *   asunto?: string          // Si no se pasa, se genera automáticamente
 *   introExtra?: string      // Texto intro opcional del director
 *   emailsExtra?: string[]   // Emails a agregar y notificar
 * }
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
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

    // Suscribir emails extra si los hay
    const extrasNormalizados: string[] = []
    for (const email of emailsExtra) {
      const e = email.trim().toLowerCase()
      if (!e) continue
      extrasNormalizados.push(e)

      // Upsert en suscriptores (si ya existe y estaba de baja, lo reactiva)
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

    // Construir learnings como lista
    const learnings = course.learnings
      ? course.learnings.split('\n').map((l: string) => l.trim()).filter(Boolean)
      : []

    // Precio display
    const esGratis = course.is_free || course.badge_type === 'free'
    const precioDisplay = esGratis
      ? 'Gratuito'
      : course.price
        ? `$${Number(course.price).toLocaleString('es-AR')}`
        : null

    const courseUrl = course.link
      ? (course.link.startsWith('http') ? course.link : `${SITE_URL}/formacion`)
      : `${SITE_URL}/formacion`

    for (const suscriptor of suscriptores) {
      try {
        const unsubUrl = `${SITE_URL}/desuscribirse?id=${suscriptor.id}`
        const nombre = suscriptor.nombre ? suscriptor.nombre.split(' ')[0] : ''
        const saludo = nombre ? `Hola ${nombre},` : 'Hola,'

        const introHtml = introExtra?.trim()
          ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#1d1d1f;">${introExtra.trim().replace(/\n/g, '<br/>')}</p>`
          : ''

        const learningsHtml = learnings.length > 0
          ? `<div style="margin:0 0 24px;padding:20px 24px;background:#EDF3F0;border-radius:12px;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#4F7566;text-transform:uppercase;letter-spacing:0.06em;">En esta formación vas a</p>
              <ul style="margin:0;padding:0 0 0 18px;">
                ${learnings.map((l: string) => `<li style="font-size:14px;line-height:1.6;color:#1d1d1f;margin-bottom:6px;">${l}</li>`).join('')}
              </ul>
            </div>`
          : ''

        const metaItems = [
          course.modality && `<span style="margin-right:20px;">📍 ${course.modality}</span>`,
          course.duration && `<span style="margin-right:20px;">⏱ ${course.duration}</span>`,
          course.level && `<span>🎯 ${course.level}</span>`,
        ].filter(Boolean).join('')

        const metaHtml = metaItems
          ? `<p style="margin:0 0 20px;font-size:13.5px;color:#6e6e73;">${metaItems}</p>`
          : ''

        const precioHtml = precioDisplay
          ? `<p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6e6e73;text-transform:uppercase;letter-spacing:0.05em;">Inversión</p>
             <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#2F7D6B;">${precioDisplay}${course.price_original && !esGratis ? ` <span style="font-size:15px;font-weight:400;color:#a1a1a6;text-decoration:line-through;">$${Number(course.price_original).toLocaleString('es-AR')}</span>` : ''}</p>`
          : ''

        const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${asuntoFinal}</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:28px 36px 20px;border-bottom:1px solid #e8e8ed;text-align:center;">
          <img src="${SITE_URL}/LOGO CON NOMBRE.png" alt="ÉCLAT" style="height:52px;width:auto;" />
          <div style="margin-top:14px;height:3px;background:linear-gradient(90deg,#4F7566,#7aab96,#4F7566);border-radius:2px;"></div>
        </td></tr>

        <!-- Badge + Título -->
        <tr><td style="background:#fff;padding:32px 36px 0;">
          <p style="margin:0 0 8px;">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:4px 12px;border-radius:20px;background:${course.badge_type === 'free' ? '#DCEFE8' : '#f5f5f7'};color:${course.badge_type === 'free' ? '#2F7D6B' : '#6e6e73'};">${course.badge}</span>
          </p>
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1d1d1f;line-height:1.2;">${course.title}</h1>
          ${metaHtml}
        </td></tr>

        <!-- Intro del director -->
        ${introHtml ? `<tr><td style="background:#fff;padding:0 36px 8px;">${introHtml}</td></tr>` : ''}

        <!-- Descripción -->
        <tr><td style="background:#fff;padding:${introHtml ? '8px' : '20px'} 36px 24px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#1d1d1f;">${(course.long_description || course.description || '').replace(/\n/g, '<br/>')}</p>
        </td></tr>

        <!-- Learnings -->
        ${learningsHtml ? `<tr><td style="background:#fff;padding:0 36px 24px;">${learningsHtml}</td></tr>` : ''}

        <!-- Precio + CTA -->
        <tr><td style="background:#fff;padding:0 36px 32px;">
          ${precioHtml}
          <a href="${courseUrl}" style="display:inline-block;padding:14px 32px;background:#2F7D6B;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
            ${course.cta || 'Ver formación →'}
          </a>
        </td></tr>

        <!-- Divisor -->
        <tr><td style="background:#fff;padding:0 36px 28px;">
          <div style="height:1px;background:#e8e8ed;"></div>
        </td></tr>

        <!-- Firma -->
        <tr><td style="background:#fff;padding:0 36px 32px;">
          <p style="margin:0;font-size:14px;color:#6e6e73;line-height:1.6;">Un saludo,<br/><strong style="color:#4F7566;">Equipo ÉCLAT · Centro de Atención Integral</strong></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9f9fb;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;border-top:1px solid #e8e8ed;">
          <p style="margin:0 0 6px;font-size:12px;color:#a1a1a6;">
            Oncativo, Córdoba · <a href="${SITE_URL}" style="color:#4F7566;text-decoration:none;">eclatcentro.com</a>
          </p>
          <p style="margin:0;font-size:11px;color:#c7c7cc;">
            Recibís este email porque estás suscripto/a a la comunidad ÉCLAT.
            <a href="${unsubUrl}" style="color:#a1a1a6;text-decoration:underline;">Desuscribirse</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

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
