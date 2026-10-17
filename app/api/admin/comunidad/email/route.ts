/**
 * POST /api/admin/comunidad/email
 * Envía un email directo a uno o varios contactos desde el panel admin.
 * Solo accesible para el director.
 *
 * Body: { destinatarios: { email, nombre? }[], asunto: string, mensaje: string }
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailDirecto from '@/emails/EmailDirecto'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { data: { user } } = await createClient().auth.getUser()
    if (user?.email !== DIRECTOR_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { destinatarios, asunto, mensaje } = await req.json()

    if (!asunto?.trim() || !mensaje?.trim() || !Array.isArray(destinatarios) || destinatarios.length === 0) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    let enviados = 0
    let errores = 0

    for (const dest of destinatarios) {
      try {
        const html = await render(EmailDirecto({
          asunto,
          mensaje,
          nombreDestinatario: dest.nombre || undefined,
        }))

        await resend.emails.send({
          from: 'ÉCLAT <hola@eclatcentro.com>',
          to: dest.email,
          subject: asunto,
          html,
        })
        enviados++
      } catch (err) {
        console.error(`Error enviando a ${dest.email}:`, err)
        errores++
      }

      if (destinatarios.length > 1) {
        await new Promise(r => setTimeout(r, 100))
      }
    }

    return NextResponse.json({ ok: true, enviados, errores })
  } catch (error) {
    console.error('Email directo error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
