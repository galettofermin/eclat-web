/**
 * POST /api/newsletter/enviar
 * Envía un newsletter a todos los suscriptores activos.
 * Solo accesible para el director (verificado por email de sesión).
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailNewsletter from '@/emails/EmailNewsletter'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

export async function POST(req: Request) {
  try {
    // Solo el director puede enviar
    const { data: { user } } = await createClient().auth.getUser()
    if (user?.email !== DIRECTOR_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { asunto, intro, articuloIds } = await req.json()
    if (!asunto || !articuloIds?.length) {
      return NextResponse.json({ error: 'Asunto y al menos un artículo son requeridos' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Traer artículos seleccionados
    const { data: articulos } = await admin
      .from('articles')
      .select('id, title, excerpt, category, image_url, author')
      .in('id', articuloIds)
      .eq('published', true)

    if (!articulos?.length) {
      return NextResponse.json({ error: 'No se encontraron artículos publicados' }, { status: 400 })
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

    // Enviar en lotes de 10 para no saturar Resend
    for (const suscriptor of suscriptores) {
      try {
        const unsubscribeUrl = `${SITE_URL}/desuscribirse?id=${suscriptor.id}`
        const html = await render(EmailNewsletter({
          asunto,
          intro: intro || undefined,
          articulos,
          unsubscribeUrl,
          siteUrl: SITE_URL,
        }))

        await resend.emails.send({
          from: 'ÉCLAT <hola@eclatcentro.com>',
          to: suscriptor.email,
          subject: asunto,
          html,
        })

        enviados++
      } catch (err) {
        console.error(`Error enviando a ${suscriptor.email}:`, err)
        errores++
      }

      // Pequeña pausa entre envíos para respetar rate limits
      await new Promise(r => setTimeout(r, 100))
    }

    // Registrar el envío
    await admin.from('newsletter_envios').insert({
      asunto,
      intro: intro || null,
      articulo_ids: articuloIds,
      total_enviados: enviados,
      total_errores: errores,
      enviado_por: user.email,
    }).catch(() => {}) // no bloquear si falla el registro

    return NextResponse.json({ ok: true, enviados, errores })
  } catch (error) {
    console.error('Newsletter enviar error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
