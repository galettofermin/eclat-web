import {
  Body, Container, Head, Html,
  Img, Link, Preview, Section, Text, Hr,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  nombre: string
  tituloCurso: string
  urlCurso: string
  descripcionCurso?: string
}

export default function EmailSeguimientoCurso({ nombre, tituloCurso, urlCurso, descripcionCurso }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Quedó algo pendiente en {tituloCurso}</Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Img
              src="https://eclatcentro.com/logo-256.png"
              alt="ÉCLAT"
              width="64"
              height="64"
              style={logoImg}
            />
            <Text style={logoText}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Oncativo</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hola, {nombre}.</Text>

            <Text style={paragraph}>
              Vimos que estuviste revisando <strong>"{tituloCurso}"</strong> y
              quería escribirte personalmente por si quedó alguna duda sin resolver.
            </Text>

            {descripcionCurso && (
              <Section style={courseBox}>
                <Text style={courseLabel}>Sobre este curso</Text>
                <Text style={courseTitle}>{tituloCurso}</Text>
                <Text style={courseDesc}>{descripcionCurso}</Text>
              </Section>
            )}

            <Text style={paragraph}>
              A veces cuesta dar el primer paso — si tenés preguntas sobre los contenidos,
              la modalidad o cómo funciona el acceso, podés responder este mail y te
              contesto directamente.
            </Text>

            <Section style={ctaSection}>
              <Link href={urlCurso} style={button}>
                Ver el curso →
              </Link>
            </Section>

            <Text style={signoff}>
              Un abrazo,<br />
              <strong>Equipo ÉCLAT</strong>
            </Text>
          </Section>

          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>ÉCLAT Centro de Atención Integral · Oncativo, Córdoba</Text>
            <Text style={footerText}>
              ¿Preferís hablar por WhatsApp?{' '}
              <Link href="https://wa.link/vyi5uv" style={footerLink}>Escribinos acá</Link>
            </Text>
            <Text style={unsubText}>
              Recibiste este mail porque visitaste uno de nuestros cursos.{' '}
              <Link href={`${urlCurso}?unsub=1`} style={unsubLink}>No quiero recibir más mails de este tipo</Link>
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

const logoImg = { display: 'block', margin: '0 auto 10px', borderRadius: '50%' }
const logoText = { color: '#FFFFFF', fontSize: '20px', fontWeight: '600', margin: '0 0 4px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }
const tagline = { color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' as const }

const content = { padding: '36px 40px 28px' }

const greeting = { color: '#1B2B26', fontSize: '20px', fontWeight: '500', margin: '0 0 20px', lineHeight: '1.3' }

const paragraph = { color: '#4B6B5E', fontSize: '15px', lineHeight: '1.75', margin: '0 0 20px' }

const courseBox = {
  margin: '20px 0', padding: '20px 24px',
  backgroundColor: '#F5F9F7', borderRadius: '6px',
  borderLeft: '3px solid #2F7D6B',
}

const courseLabel = { color: '#2F7D6B', fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 6px' }
const courseTitle = { color: '#1B2B26', fontSize: '17px', fontWeight: '600', margin: '0 0 8px' }
const courseDesc = { color: '#6B8C83', fontSize: '13px', lineHeight: '1.6', margin: '0' }

const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }

const button = {
  backgroundColor: '#2F7D6B', color: '#FFFFFF',
  fontSize: '14px', fontWeight: '500',
  padding: '12px 28px', borderRadius: '4px',
  textDecoration: 'none', display: 'inline-block',
}

const signoff = { color: '#4B6B5E', fontSize: '15px', lineHeight: '1.7', margin: '24px 0 0' }

const divider = { borderColor: '#E8EDE9', margin: '0' }
const footer = { padding: '20px 40px', textAlign: 'center' as const }
const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }
const footerLink = { color: '#9CA8A3', textDecoration: 'underline' }
const unsubText = { color: '#C4CECA', fontSize: '11px', margin: '12px 0 0', lineHeight: '1.5' }
const unsubLink = { color: '#C4CECA', textDecoration: 'underline' }
