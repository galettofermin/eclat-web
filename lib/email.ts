import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailBienvenida from '@/emails/EmailBienvenida'
import EmailAccesoCurso from '@/emails/EmailAccesoCurso'
import EmailModuloCompletado from '@/emails/EmailModuloCompletado'
import EmailMensajeNuevo from '@/emails/EmailMensajeNuevo'
import EmailSeguimientoCurso from '@/emails/EmailSeguimientoCurso'

const FROM = 'ÉCLAT <hola@eclatcentro.com>'

export async function enviarBienvenida(params: {
  email: string
  nombre: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(EmailBienvenida({ nombre: params.nombre }))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: '¡Bienvenido/a a ÉCLAT!',
    html,
  })
}

export async function enviarAccesoCurso(params: {
  email: string
  nombre: string
  tituloCurso: string
  urlCurso: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(EmailAccesoCurso(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Tu acceso a "${params.tituloCurso}" está activo`,
    html,
  })
}

export async function enviarModuloCompletado(params: {
  email: string
  nombre: string
  tituloCurso: string
  tituloModulo: string
  puntaje: number
  urlSiguienteModulo?: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(EmailModuloCompletado(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Completaste el módulo "${params.tituloModulo}"`,
    html,
  })
}

export async function enviarNotificacionMensaje(params: {
  email: string
  nombreDestinatario: string
  nombreRemitente: string
  preview: string
  urlBandeja: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(EmailMensajeNuevo(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Nuevo mensaje de ${params.nombreRemitente}`,
    html,
  })
}

export async function enviarSeguimientoCurso(params: {
  email: string
  nombre: string
  tituloCurso: string
  urlCurso: string
  descripcionCurso?: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(EmailSeguimientoCurso(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `¿Te quedó alguna duda sobre "${params.tituloCurso}"?`,
    html,
  })
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

// Aviso interno de una inscripción nueva desde el modal del curso
export async function enviarNuevaInscripcion(params: {
  courseTitle: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  localidad: string
  rol: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const rows: [string, string][] = [
    ['Curso', params.courseTitle],
    ['Nombre', `${params.nombre} ${params.apellido}`],
    ['Mail', params.email],
    ['Teléfono', params.telefono],
    ['Localidad', params.localidad],
    ['Se acerca como', params.rol || '—'],
  ]
  const html = `
    <h2 style="font-family:sans-serif;color:#29332F">Nueva inscripción</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#6E6E73">${k}</td><td style="padding:6px 0;color:#29332F"><b>${escapeHtml(v)}</b></td></tr>`).join('')}
    </table>`
  return resend.emails.send({
    from: FROM,
    to: 'centrointegraleclat@gmail.com',
    replyTo: params.email,
    subject: `Nueva inscripción — ${params.courseTitle}`,
    html,
  })
}

// Confirmación al alumno de que su inscripción llegó
export async function enviarConfirmacionInscripcion(params: {
  email: string
  nombre: string
  courseTitle: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = `
    <div style="background:#F5F5F5;padding:32px 0;font-family:'Plus Jakarta Sans',Arial,sans-serif">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="background:#F7F5F0;padding:36px 40px 28px;text-align:center;border-bottom:1px solid #D8E8E0;position:relative">
          <div style="height:3px;background:linear-gradient(90deg,transparent 0%,#A8C9BC 30%,#2F7D6B 50%,#A8C9BC 70%,transparent 100%);margin-bottom:24px"></div>
          <img src="https://eclatcentro.com/logo-256.png" width="72" height="72" alt="ÉCLAT" style="display:block;margin:0 auto 10px" />
          <p style="color:#7FA294;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin:0">Centro de Atención Integral</p>
          <div style="margin-top:20px;height:1px;background:linear-gradient(90deg,transparent 0%,#C5DDD5 20%,#8BBDAD 50%,#C5DDD5 80%,transparent 100%)"></div>
        </div>
        <div style="padding:36px 40px 28px;font-size:15px;line-height:1.7;color:#4B6B5E">
          <p style="margin:0 0 16px">Hola ${escapeHtml(params.nombre)},</p>
          <p style="margin:0 0 16px">Recibimos tu inscripción a <b style="color:#1B2B26">${escapeHtml(params.courseTitle)}</b>. En cuanto confirmemos tu pago habilitaremos tu acceso.</p>
          <p style="margin:0 0 24px">Podés ingresar desde <a href="https://eclatcentro.com/mi-cuenta" style="color:#2F7D6B">eclatcentro.com/mi-cuenta</a> con tu mail y contraseña.</p>
          <p style="margin:0;color:#7FA294">Equipo ÉCLAT</p>
        </div>
        <div style="border-top:1px solid #E8EDE9;padding:20px 40px;text-align:center">
          <p style="color:#9CA8A3;font-size:12px;margin:0">ÉCLAT Centro de Atención Integral · Oncativo, Córdoba</p>
        </div>
      </div>
    </div>`
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Tu inscripción a ${params.courseTitle} — ÉCLAT`,
    html,
  })
}

// Link para elegir una contraseña nueva, enviado a pedido del admin
export async function enviarResetPassword(params: { email: string; link: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = `
    <div style="background:#F5F5F5;padding:32px 0;font-family:'Plus Jakarta Sans',Arial,sans-serif">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
        <div style="background:#F7F5F0;padding:36px 40px 28px;text-align:center;border-bottom:1px solid #D8E8E0">
          <div style="height:3px;background:linear-gradient(90deg,transparent 0%,#A8C9BC 30%,#2F7D6B 50%,#A8C9BC 70%,transparent 100%);margin-bottom:24px"></div>
          <img src="https://eclatcentro.com/logo-256.png" width="72" height="72" alt="ÉCLAT" style="display:block;margin:0 auto 10px" />
          <p style="color:#7FA294;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin:0">Centro de Atención Integral</p>
          <div style="margin-top:20px;height:1px;background:linear-gradient(90deg,transparent 0%,#C5DDD5 20%,#8BBDAD 50%,#C5DDD5 80%,transparent 100%)"></div>
        </div>
        <div style="padding:36px 40px 28px;font-size:15px;line-height:1.7;color:#4B6B5E">
          <p style="margin:0 0 16px">Hola,</p>
          <p style="margin:0 0 24px">Para elegir una contraseña nueva para tu cuenta de ÉCLAT, entrá acá:</p>
          <p style="text-align:center;margin:0 0 24px"><a href="${escapeHtml(params.link)}" style="display:inline-block;background:#2F7D6B;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Elegir contraseña nueva</a></p>
          <p style="margin:0 0 16px;font-size:13px;color:#9CA8A3">El link vence en una hora. Si no pediste este cambio, ignorá este mail.</p>
          <p style="margin:0;color:#7FA294">Equipo ÉCLAT</p>
        </div>
        <div style="border-top:1px solid #E8EDE9;padding:20px 40px;text-align:center">
          <p style="color:#9CA8A3;font-size:12px;margin:0">ÉCLAT Centro de Atención Integral · Oncativo, Córdoba</p>
        </div>
      </div>
    </div>`
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: 'Elegí tu nueva contraseña — ÉCLAT',
    html,
  })
}
