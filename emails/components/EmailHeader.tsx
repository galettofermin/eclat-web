import { Img, Section, Text } from '@react-email/components'
import * as React from 'react'

/**
 * Encabezado compartido para todos los emails de ÉCLAT.
 * Fondo crema claro con logo centrado y líneas decorativas verdes.
 */
export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src="https://eclatcentro.com/logo-256.png"
        alt="ÉCLAT"
        width="72"
        height="72"
        style={logo}
      />
      <Text style={tagline}>Salud Mental · Educación y Acompañamiento Interdisciplinario</Text>

      <div style={decorBottom} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '36px 40px 28px',
  textAlign: 'center',
  borderBottom: '1px solid #D8E8E0',
}

const logo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 10px',
}

const tagline: React.CSSProperties = {
  color: '#7FA294',
  fontSize: '10px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  margin: '0',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

// Línea decorativa inferior
const decorBottom: React.CSSProperties = {
  marginTop: '20px',
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, #C5DDD5 20%, #8BBDAD 50%, #C5DDD5 80%, transparent 100%)',
}
