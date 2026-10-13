import { Img, Section, Text } from '@react-email/components'
import * as React from 'react'

/**
 * Encabezado compartido para todos los emails de ÉCLAT.
 * Fondo crema claro con logo centrado y líneas decorativas verdes.
 */
export default function EmailHeader() {
  return (
    <Section style={header}>
      {/* Líneas decorativas SVG incrustadas como imagen data URI */}
      <div style={decorTop} />

      <Img
        src="https://eclatcentro.com/logo-256.png"
        alt="ÉCLAT"
        width="72"
        height="72"
        style={logo}
      />
      <Text style={tagline}>Centro de Atención Integral</Text>

      <div style={decorBottom} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#F7F5F0',
  padding: '36px 40px 28px',
  textAlign: 'center',
  position: 'relative',
  borderBottom: '1px solid #D8E8E0',
  overflow: 'hidden',
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

// Línea decorativa superior — borde verde muy sutil
const decorTop: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: 'linear-gradient(90deg, transparent 0%, #A8C9BC 30%, #2F7D6B 50%, #A8C9BC 70%, transparent 100%)',
}

// Línea decorativa inferior — más sutil
const decorBottom: React.CSSProperties = {
  marginTop: '20px',
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, #C5DDD5 20%, #8BBDAD 50%, #C5DDD5 80%, transparent 100%)',
}
