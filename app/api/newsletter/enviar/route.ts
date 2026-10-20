/**
 * POST /api/newsletter/enviar
 * Envía un newsletter compuesto por bloques a suscriptores seleccionados.
 *
 * Body:
 *   {
 *     asunto: string
 *     bloques: Bloque[]           // nuevo sistema unificado
 *     suscriptorIds?: string[]    // si se omite → todos los activos
 *     prueba?: boolean            // envía solo al director
 *   }
 *
 * Tipos de bloque:
 *   { tipo: 'articulo',      articuloId: string }
 *   { tipo: 'formacion',     cursoId: string }
 *   { tipo: 'institucional', texto: string, imagenUrl?: string }
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
    const { asunto, bloques, suscriptorIds, prueba } = body

    if (!asunto?.trim()) {
      return NextResponse.json({ error: 'El asunto es requerido' }, { status: 400 })
    }
    if (!Array.isArray(bloques) || bloques.length === 0) {
      return NextResponse.json({ error: 'Incluí al menos un bloque' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Resolver datos de cada bloque
    const bloquesResueltos = await Promise.all(bloques.map(async (b: { tipo: string; articuloId?: string; cursoId?: string; texto?: string; imagenUrl?: string; pdfUrl?: string; pdfNombre?: string }) => {
      if (b.tipo === 'articulo') {
        const { data } = await admin
          .from('articles')
          .select('id, title, excerpt, category, image_url, author')
          .eq('id', b.articuloId)
          .eq('published', true)
          .single()
        if (!data) throw new Error(`Artículo no encontrado: ${b.articuloId}`)
        return { tipo: 'articulo' as const, articulo: data }
      }
      if (b.tipo === 'formacion') {
        const { data } = await admin
          .from('courses')
          .select('id, title, description, badge, badge_type, link, cta, duration, modality')
          .eq('id', b.cursoId)
          .eq('published', true)
          .single()
        if (!data) throw new Error(`Curso no encontrado: ${b.cursoId}`)
        return { tipo: 'formacion' as const, curso: data }
      }
      if (b.tipo === 'institucional') {
        if (!b.texto?.trim()) throw new Error('El mensaje institucional no puede estar vacío')
        return { tipo: 'institucional' as const, texto: b.texto, imagenUrl: b.imagenUrl, pdfUrl: b.pdfUrl, pdfNombre: b.pdfNombre }
      }
      throw new Error(`Tipo de bloque desconocido: ${b.tipo}`)
    }))

    // Destinatarios
    let suscriptores: { id: string; email: string; nombre: string | null }[] = []

    if (prueba) {
      // Solo enviar al director
      suscriptores = [{ id: 'prueba', email: user.email!, nombre: 'Admin' }]
    } else if (Array.isArray(suscriptorIds) && suscriptorIds.length > 0) {
      const { data } = await admin
        .from('suscriptores')
        .select('id, email, nombre')
        .in('id', suscriptorIds)
        .eq('activo', true)
      suscriptores = data ?? []
    } else {
      const { data } = await admin
        .from('suscriptores')
        .select('id, email, nombre')
        .eq('activo', true)
      suscriptores = data ?? []
    }

    if (!suscriptores.length) {
      return NextResponse.json({ error: 'No hay destinatarios' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    let enviados = 0
    let errores = 0

    for (const suscriptor of suscriptores) {
      try {
        const unsubscribeUrl = `${SITE_URL}/desuscribirse?id=${suscriptor.id}`
        const html = await render(EmailNewsletter({
          asunto,
          bloques: bloquesResueltos,
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
      await new Promise(r => setTimeout(r, 100))
    }

    // Registrar en historial (solo envíos reales, no pruebas)
    if (!prueba) {
      try {
        await admin.from('newsletter_envios').insert({
          asunto,
          bloques: bloques,
          total_enviados: enviados,
          total_errores: errores,
          enviado_por: user.email,
        })
      } catch (e) {
        console.error('No se pudo guardar historial:', e)
      }
    }

    return NextResponse.json({ ok: true, enviados, errores })
  } catch (error: unknown) {
    console.error('Newsletter enviar error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error interno' }, { status: 500 })
  }
}
