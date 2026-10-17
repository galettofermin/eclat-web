import { Img, Section, Text } from '@react-email/components'
import * as React from 'react'

/**
 * Encabezado unificado para todos los emails de ÉCLAT.
 * Logo centrado + "ÉCLAT" en verde sage + línea verde. Estilo limpio.
 */
export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src="https://eclatcentro.com/logo-256.png"
        alt="ÉCLAT"
        width="56"
        height="56"
        style={logo}
      />
      <Text style={brand}>ÉCLAT</Text>
      <div style={line} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '36px 40px 24px',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 10px',
}

const brand: React.CSSProperties = {
  color: '#4F7566',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  margin: '0 0 20px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const line: React.CSSProperties = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, #B8D4CA 30%, #7FA294 50%, #B8D4CA 70%, transparent 100%)',
  margin: '0',
}
