import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  nombre: string
  tituloCurso: string
  urlCurso: string
  email?: string
}

export default function EmailAccesoCurso({ nombre, tituloCurso, urlCurso }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu acceso a "{tituloCurso}" está activo — empezá ahora</Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Text style={logo}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Rosario</Text>
          </Section>

          <Section style={successBanner}>
            <Text style={successIcon}>✓</Text>
            <Text style={successText}>Pago confirmado</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>¡Tu acceso está activo, {nombre}!</Heading>
            <Text style={paragraph}>
              El pago de <strong>"{tituloCurso}"</strong> fue procesado exitosamente.
              Ya podés acceder a todos los módulos y materiales del curso.
            </Text>

            <Section style={courseBox}>
              <Text style={courseLabel}>Formación</Text>
              <Text style={courseTitle}>{tituloCurso}</Text>
              <Text style={courseDetail}>Acceso de por vida · Materiales descargables · Evaluaciones</Text>
            </Section>

            <Section style={ctaSection}>
              <Link href={urlCurso} style={button}>
                Ir al curso →
              </Link>
            </Section>

            <Text style={noteText}>
              Podés acceder a tus cursos en cualquier momento desde{' '}
              <Link href="https://eclatcentro.com/mis-cursos" style={inlineLink}>Mis cursos</Link>.
            </Text>
          </Section>

          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>ÉCLAT Centro de Atención Integral · Rosario, Argentina</Text>
            <Text style={footerText}>
              ¿Problemas? Escribinos a{' '}
              <Link href="https://wa.link/vyi5uv" style={footerLink}>WhatsApp</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#F5F5F5', fontFamily: 'Georgia, serif' }

const container = {
  maxWidth: '560px', margin: '32px auto',
  backgroundColor: '#FFFFFF', borderRadius: '8px',
  overflow: 'hidden' as const,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const header = {
  backgroundColor: '#1B2B26', padding: '28px 40px',
  textAlign: 'center' as const,
}

const logo = { color: '#FFFFFF', fontSize: '24px', fontWeight: '600', margin: '0', letterSpacing: '-0.5px' }
const tagline = { color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' as const }

const successBanner = {
  backgroundColor: '#DCEFE8', padding: '16px 40px',
  textAlign: 'center' as const,
}

const successIcon = { color: '#2F7D6B', fontSize: '20px', margin: '0', fontWeight: '600' }
const successText = { color: '#2F7D6B', fontSize: '13px', fontWeight: '600', margin: '4px 0 0', letterSpacing: '0.05em' }

const content = { padding: '36px 40px 28px' }

const h1 = { color: '#1B2B26', fontSize: '22px', fontWeight: '400', margin: '0 0 16px', lineHeight: '1.3' }

const paragraph = { color: '#4B6B5E', fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px' }

const courseBox = {
  margin: '20px 0', padding: '20px 24px',
  backgroundColor: '#F5F9F7', borderRadius: '6px',
  borderLeft: '3px solid #2F7D6B',
}

const courseLabel = { color: '#2F7D6B', fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 6px' }
const courseTitle = { color: '#1B2B26', fontSize: '17px', fontWeight: '600', margin: '0 0 6px' }
const courseDetail = { color: '#6B8C83', fontSize: '13px', margin: '0' }

const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }

const button = {
  backgroundColor: '#2F7D6B', color: '#FFFFFF',
  fontSize: '14px', fontWeight: '500',
  padding: '12px 28px', borderRadius: '4px',
  textDecoration: 'none', display: 'inline-block',
}

const noteText = { color: '#6B8C83', fontSize: '13px', lineHeight: '1.6', textAlign: 'center' as const, margin: '0' }
const inlineLink = { color: '#2F7D6B', textDecoration: 'underline' }

const divider = { borderColor: '#E8EDE9', margin: '0' }
const footer = { padding: '20px 40px', textAlign: 'center' as const }
const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }
const footerLink = { color: '#9CA8A3', textDecoration: 'underline' }
