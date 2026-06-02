import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface Props { nombre: string }

export default function EmailBienvenida({ nombre }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Bienvenido/a a ÉCLAT! Tu cuenta ya está activa.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Rosario</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>¡Bienvenido/a, {nombre}!</Heading>
            <Text style={paragraph}>
              Tu cuenta en ÉCLAT ya está activa. Ahora podés explorar nuestras
              formaciones y acceder a todo el contenido disponible.
            </Text>

            <Section style={pillarsSection}>
              <Text style={pillarItem}>🎯 <strong>Clínica interdisciplinaria</strong> — Psicología, psicopedagogía, fonoaudiología y más</Text>
              <Text style={pillarItem}>📚 <strong>Formación profesional</strong> — Cursos y diplomaturas para profesionales, docentes y familias</Text>
              <Text style={pillarItem}>✍️ <strong>Escritos y recursos</strong> — Artículos del equipo para acompañar tu práctica</Text>
            </Section>

            <Section style={ctaSection}>
              <Link href="https://eclatcentro.com/formacion" style={button}>
                Explorar formaciones
              </Link>
            </Section>

            <Text style={paragraph}>
              Si tenés alguna pregunta, respondé este email o escribinos por WhatsApp.
              Estamos para acompañarte.
            </Text>
          </Section>

          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              ÉCLAT Centro de Atención Integral · Rosario, Argentina
            </Text>
            <Text style={footerText}>
              <Link href="https://eclatcentro.com" style={footerLink}>eclatcentro.com</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// ── Estilos ───────────────────────────────────────────────
const body = { backgroundColor: '#F5F5F5', fontFamily: 'Georgia, serif' }

const container = {
  maxWidth: '560px', margin: '32px auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  overflow: 'hidden' as const,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const header = {
  backgroundColor: '#1B2B26',
  padding: '28px 40px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#FFFFFF', fontSize: '24px',
  fontWeight: '600', margin: '0',
  letterSpacing: '-0.5px',
}

const tagline = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '12px', margin: '4px 0 0',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const,
}

const content = { padding: '36px 40px 28px' }

const h1 = {
  color: '#1B2B26', fontSize: '24px',
  fontWeight: '400', margin: '0 0 16px',
  lineHeight: '1.3',
}

const paragraph = {
  color: '#4B6B5E', fontSize: '15px',
  lineHeight: '1.7', margin: '0 0 20px',
}

const pillarsSection = { margin: '24px 0', padding: '20px 24px', backgroundColor: '#F5F9F7', borderRadius: '6px' }

const pillarItem = {
  color: '#2D4A42', fontSize: '14px',
  lineHeight: '1.6', margin: '0 0 10px',
}

const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }

const button = {
  backgroundColor: '#2F7D6B', color: '#FFFFFF',
  fontSize: '14px', fontWeight: '500',
  padding: '12px 28px', borderRadius: '4px',
  textDecoration: 'none', display: 'inline-block',
}

const divider = { borderColor: '#E8EDE9', margin: '0' }

const footer = { padding: '20px 40px', textAlign: 'center' as const }

const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }

const footerLink = { color: '#9CA8A3', textDecoration: 'underline' }
