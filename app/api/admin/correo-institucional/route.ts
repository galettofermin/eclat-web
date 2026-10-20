/**
 * POST /api/admin/correo-institucional
 * Envía un correo institucional individual a un destinatario puntual.
 *
 * Body:
 *   {
 *     asunto: string
 *     texto: string
 *     destinatarioEmail: string
 *     destinatarioNombre?: string
 *     imagenUrl?: string
 *     pdfUrl?: string
 *     pdfNombre?: string
 *   }
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailNewsletter from '@/emails/EmailNewsletter'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

export async function POST(req: Request) {
  try {
    const { data: { user } } = await createClient().auth.getUser()
    if (user?.email !== DIRECTOR_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { asunto, texto, destinatarioEmail, destinatarioNombre, imagenUrl, pdfUrl, pdfNombre } = body

    if (!asunto?.trim()) return NextResponse.json({ error: 'El asunto es requerido' }, { status: 400 })
    if (!texto?.trim()) return NextResponse.json({ error: 'El texto es requerido' }, { status: 400 })
    if (!destinatarioEmail?.trim()) return NextResponse.json({ error: 'El email del destinatario es requerido' }, { status: 400 })

    const bloques = [{
      tipo: 'institucional' as const,
      texto: texto.trim(),
      imagenUrl: imagenUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      pdfNombre: pdfNombre || undefined,
    }]

    const html = await render(EmailNewsletter({
      asunto,
      bloques,
      unsubscribeUrl: '',
      siteUrl: SITE_URL,
      nombreDestinatario: destinatarioNombre || undefined,
    }))

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'ÉCLAT <hola@eclatcentro.com>',
      to: destinatarioEmail.trim(),
      reply_to: 'centrointegraleclat@gmail.com',
      subject: asunto,
      html,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error('Correo institucional error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error interno' }, { status: 500 })
  }
}
