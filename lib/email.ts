import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailBienvenida from '@/emails/EmailBienvenida'
import EmailAccesoCurso from '@/emails/EmailAccesoCurso'
import EmailModuloCompletado from '@/emails/EmailModuloCompletado'
import EmailMensajeNuevo from '@/emails/EmailMensajeNuevo'
import EmailSeguimientoCurso from '@/emails/EmailSeguimientoCurso'
import EmailConfirmacionInscripcion from '@/emails/EmailConfirmacionInscripcion'
import EmailResetPassword from '@/emails/EmailResetPassword'

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
  const html = await render(EmailConfirmacionInscripcion({
    nombre: params.nombre,
    courseTitle: params.courseTitle,
  }))
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
  const html = await render(EmailResetPassword({ link: params.link }))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: 'Elegí tu nueva contraseña — ÉCLAT',
    html,
  })
}
