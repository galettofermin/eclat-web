import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailBienvenida from '@/emails/EmailBienvenida'
import EmailAccesoCurso from '@/emails/EmailAccesoCurso'
import EmailModuloCompletado from '@/emails/EmailModuloCompletado'
import EmailMensajeNuevo from '@/emails/EmailMensajeNuevo'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'ÉCLAT <hola@eclatcentro.com>'

// ── Bienvenida al registrarse ────────────────────────────
export async function enviarBienvenida(params: {
  email: string
  nombre: string
}) {
  const html = await render(EmailBienvenida({ nombre: params.nombre }))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: '¡Bienvenido/a a ÉCLAT!',
    html,
  })
}

// ── Acceso al curso activado (pago confirmado) ───────────
export async function enviarAccesoCurso(params: {
  email: string
  nombre: string
  tituloCurso: string
  urlCurso: string
}) {
  const html = await render(EmailAccesoCurso(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Tu acceso a "${params.tituloCurso}" está activo`,
    html,
  })
}

// ── Módulo completado ─────────────────────────────────────
export async function enviarModuloCompletado(params: {
  email: string
  nombre: string
  tituloCurso: string
  tituloModulo: string
  puntaje: number
  urlSiguienteModulo?: string
}) {
  const html = await render(EmailModuloCompletado(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Completaste el módulo "${params.tituloModulo}"`,
    html,
  })
}

// ── Mensaje interno nuevo ────────────────────────────────
export async function enviarNotificacionMensaje(params: {
  email: string
  nombreDestinatario: string
  nombreRemitente: string
  preview: string
  urlBandeja: string
}) {
  const html = await render(EmailMensajeNuevo(params))
  return resend.emails.send({
    from: FROM,
    to: params.email,
    subject: `Nuevo mensaje de ${params.nombreRemitente}`,
    html,
  })
}
