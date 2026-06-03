import { Resend } from 'resend'
import { render } from '@react-email/render'
import EmailBienvenida from '@/emails/EmailBienvenida'
import EmailAccesoCurso from '@/emails/EmailAccesoCurso'
import EmailModuloCompletado from '@/emails/EmailModuloCompletado'
import EmailMensajeNuevo from '@/emails/EmailMensajeNuevo'

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
