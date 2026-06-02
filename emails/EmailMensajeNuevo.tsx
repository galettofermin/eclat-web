import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  nombreDestinatario: string
  nombreRemitente: string
  preview: string
  urlBandeja: string
  email?: string
}

export default function EmailMensajeNuevo({
  nombreDestinatario, nombreRemitente, preview, urlBandeja,
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Nuevo mensaje de {nombreRemitente} — ÉCLAT</Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Text style={logo}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Rosario</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Nuevo mensaje</Heading>
            <Text style={paragraph}>
              Hola {nombreDestinatario}, recibiste un mensaje de{' '}
              <strong>{nombreRemitente}</strong>:
            </Text>

            <Section style={messageBox}>
              <Text style={messagePreview}>"{preview}"</Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={urlBandeja} style={button}>
                Ver mensaje completo →
              </Link>
            </Section>

            <Text style={noteText}>
              Respondé directamente desde tu bandeja de mensajes en la plataforma.
            </Text>
          </Section>

          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>ÉCLAT Centro de Atención Integral · Rosario, Argentina</Text>
            <Text style={footerText}>Este email fue enviado automáticamente. No respondas a esta dirección.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#F5F5F5', fontFamily: 'Georgia, serif' }
const container = { maxWidth: '560px', margin: '32px auto', backgroundColor: '#FFFFFF', borderRadius: '8px', overflow: 'hidden' as const, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
const header = { backgroundColor: '#1B2B26', padding: '28px 40px', textAlign: 'center' as const }
const logo = { color: '#FFFFFF', fontSize: '24px', fontWeight: '600', margin: '0', letterSpacing: '-0.5px' }
const tagline = { color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' as const }
const content = { padding: '36px 40px 28px' }
const h1 = { color: '#1B2B26', fontSize: '22px', fontWeight: '400', margin: '0 0 16px', lineHeight: '1.3' }
const paragraph = { color: '#4B6B5E', fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px' }
const messageBox = { margin: '20px 0', padding: '20px 24px', backgroundColor: '#F5F9F7', borderRadius: '6px', borderLeft: '3px solid #B7D8CC' }
const messagePreview = { color: '#2D4A42', fontSize: '15px', lineHeight: '1.6', margin: '0', fontStyle: 'italic' }
const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }
const button = { backgroundColor: '#2F7D6B', color: '#FFFFFF', fontSize: '14px', fontWeight: '500', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }
const noteText = { color: '#6B8C83', fontSize: '13px', lineHeight: '1.6', textAlign: 'center' as const, margin: '0' }
const divider = { borderColor: '#E8EDE9', margin: '0' }
const footer = { padding: '20px 40px', textAlign: 'center' as const }
const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }
