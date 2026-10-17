/**
 * POST /api/newsletter/enviar
 * Envía un newsletter a todos los suscriptores activos.
 * Solo accesible para el director (verificado por email de sesión).
 *
 * Acepta dos modos:
 *   - Artículos:  { asunto, intro?, articuloIds: string[] }
 *   - Escrito:    { asunto, contenido: string }
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

    const body = await req.json()
    const { asunto, intro, articuloIds, contenido } = body

    if (!asunto) {
      return NextResponse.json({ error: 'El asunto es requerido' }, { status: 400 })
    }

    const modoEscrito = !!contenido?.trim()
    const modoArticulos = !modoEscrito && Array.isArray(articuloIds) && articuloIds.length > 0

    if (!modoEscrito && !modoArticulos) {
      return NextResponse.json(
        { error: 'Incluí un contenido escrito o al menos un artículo' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Traer artículos solo si se necesitan
    let articulos: { id: string; title: string; excerpt: string; category: string; image_url?: string | null; author?: string | null }[] = []
    if (modoArticulos) {
      const { data } = await admin
        .from('articles')
        .select('id, title, excerpt, category, image_url, author')
        .in('id', articuloIds)
        .eq('published', true)

      if (!data?.length) {
        return NextResponse.json({ error: 'No se encontraron artículos publicados' }, { status: 400 })
      }
      articulos = data
    }

    // Traer cursos publicados para mostrar al final del email
    const { data: cursosData } = await admin
      .from('courses')
      .select('id, title, description, badge, badge_type, link, cta, duration, modality')
      .eq('published', true)
      .order('sort_order')
      .limit(3)
    const cursos = cursosData ?? []

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

    // Enviar en lotes con pausa entre mensajes para respetar rate limits
    for (const suscriptor of suscriptores) {
      try {
        const unsubscribeUrl = `${SITE_URL}/desuscribirse?id=${suscriptor.id}`
        const html = await render(EmailNewsletter({
          asunto,
          contenido: modoEscrito ? contenido : undefined,
          intro: modoArticulos ? (intro || undefined) : undefined,
          articulos,
          cursos,
          unsubscribeUrl,
          siteUrl: SITE_URL,
          nombreDestinatario: suscriptor.nombre || undefined,
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

      // Pequeña pausa para respetar rate limits de Resend
      await new Promise(r => setTimeout(r, 100))
    }

    // Registrar el envío
    await admin.from('newsletter_envios').insert({
      asunto,
      intro: intro || null,
      articulo_ids: modoArticulos ? articuloIds : null,
      contenido: modoEscrito ? contenido : null,
      total_enviados: enviados,
      total_errores: errores,
      enviado_por: user.email,
    })

    return NextResponse.json({ ok: true, enviados, errores })
  } catch (error) {
    console.error('Newsletter enviar error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
