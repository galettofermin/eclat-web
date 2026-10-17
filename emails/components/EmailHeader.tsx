import { Img, Section } from '@react-email/components'
import * as React from 'react'

const SITE_URL = 'https://eclatcentro.com'

/**
 * Encabezado unificado para todos los emails de ÉCLAT.
 * Usa el logo completo (isotipo + texto ÉCLAT en sage green).
 */
export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src={`${SITE_URL}/LOGO%20CON%20NOMBRE.png`}
        alt="ÉCLAT"
        height="64"
        style={logo}
      />
      <div style={line} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '32px 40px 0',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 24px',
  height: '64px',
  width: 'auto',
}

const line: React.CSSProperties = {
  height: '3px',
  background: 'linear-gradient(90deg, #4F7566 0%, #7aab96 50%, #4F7566 100%)',
  borderRadius: '2px',
  margin: '0',
}
