import {
  Body, Container, Head, Heading, Hr, Html,
  Link, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface Props {
  nombre: string
  tituloCurso: string
  tituloModulo: string
  puntaje: number
  urlSiguienteModulo?: string
  email?: string
}

export default function EmailModuloCompletado({
  nombre, tituloCurso, tituloModulo, puntaje, urlSiguienteModulo,
}: Props) {
  const aprobado = puntaje >= 60
  const puntajeColor = aprobado ? '#2F7D6B' : '#D97706'

  return (
    <Html lang="es">
      <Head />
      <Preview>
        {aprobado
          ? `¡Aprobaste "${tituloModulo}" con ${puntaje}%!`
          : `Completaste "${tituloModulo}" — puntaje: ${puntaje}%`}
      </Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Text style={logo}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Rosario</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>
              {aprobado ? `¡Muy bien, ${nombre}!` : `Seguí intentando, ${nombre}`}
            </Heading>

            <Text style={paragraph}>
              Completaste el módulo <strong>"{tituloModulo}"</strong> del curso{' '}
              <strong>{tituloCurso}</strong>.
            </Text>

            {/* Puntaje */}
            <Section style={scoreBox}>
              <Text style={scoreLabel}>Tu resultado</Text>
              <Text style={{ ...scoreNumber, color: puntajeColor }}>{puntaje}%</Text>
              <Text style={scoreStatus}>
                {aprobado ? '✓ Módulo aprobado' : `Necesitás 60% para aprobar — podés volver a intentarlo`}
              </Text>
            </Section>

            {aprobado && urlSiguienteModulo && (
              <>
                <Text style={paragraph}>
                  El siguiente módulo ya está disponible. Cuando quieras seguir:
                </Text>
                <Section style={ctaSection}>
                  <Link href={urlSiguienteModulo} style={button}>
                    Ir al siguiente módulo →
                  </Link>
                </Section>
              </>
            )}

            {aprobado && !urlSiguienteModulo && (
              <Section style={completedBox}>
                <Text style={completedText}>
                  🎉 <strong>¡Completaste todos los módulos!</strong><br />
                  En breve recibirás tu certificado por email.
                </Text>
              </Section>
            )}

            {!aprobado && (
              <Section style={ctaSection}>
                <Link href="https://eclatcentro.com/mis-cursos" style={buttonOutline}>
                  Volver a intentar
                </Link>
              </Section>
            )}
          </Section>

          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>ÉCLAT Centro de Atención Integral · Rosario, Argentina</Text>
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
const scoreBox = { margin: '20px 0', padding: '24px', backgroundColor: '#F5F9F7', borderRadius: '6px', textAlign: 'center' as const }
const scoreLabel = { color: '#6B8C83', fontSize: '12px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 8px' }
const scoreNumber = { fontSize: '48px', fontWeight: '300', margin: '0 0 8px', lineHeight: '1' }
const scoreStatus = { color: '#4B6B5E', fontSize: '13px', margin: '0' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = { backgroundColor: '#2F7D6B', color: '#FFFFFF', fontSize: '14px', fontWeight: '500', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }
const buttonOutline = { backgroundColor: 'transparent', color: '#2F7D6B', fontSize: '14px', fontWeight: '500', padding: '11px 28px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block', border: '1px solid #2F7D6B' }
const completedBox = { margin: '20px 0', padding: '20px 24px', backgroundColor: '#DCEFE8', borderRadius: '6px', textAlign: 'center' as const }
const completedText = { color: '#1B2B26', fontSize: '15px', lineHeight: '1.6', margin: '0' }
const divider = { borderColor: '#E8EDE9', margin: '0' }
const footer = { padding: '20px 40px', textAlign: 'center' as const }
const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }
