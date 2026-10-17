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
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://eclatcentro.com'

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
        const saludoNombre = dest.nombre ? dest.nombre.split(' ')[0] : ''
        const saludo = saludoNombre ? `Hola ${saludoNombre},` : 'Hola,'

        // Convertir saltos de línea en párrafos HTML
        const parrafos = mensaje
          .split(/\n\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean)
          .map((p: string) =>
            `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1d1d1f;">${p.replace(/\n/g, '<br/>')}</p>`
          )
          .join('')

        const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${asunto}</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:28px 36px 20px;border-bottom:1px solid #e8e8ed;text-align:center;">
          <img src="${SITE_URL}/LOGO CON NOMBRE.png" alt="ÉCLAT" style="height:52px;width:auto;" />
          <div style="margin-top:14px;height:3px;background:linear-gradient(90deg,#4F7566,#7aab96,#4F7566);border-radius:2px;"></div>
        </td></tr>

        <!-- Cuerpo -->
        <tr><td style="background:#fff;padding:32px 36px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1d1d1f;">${saludo}</p>
          ${parrafos}
          <p style="margin:24px 0 0;font-size:14px;color:#6e6e73;line-height:1.6;">Un saludo,<br/><strong style="color:#4F7566;">ÉCLAT · Centro de Atención Integral</strong></p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9f9fb;border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;border-top:1px solid #e8e8ed;">
          <p style="margin:0;font-size:12px;color:#a1a1a6;line-height:1.6;">
            Oncativo, Córdoba · <a href="https://eclatcentro.com" style="color:#4F7566;text-decoration:none;">eclatcentro.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

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

      // Respetar rate limit de Resend
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
