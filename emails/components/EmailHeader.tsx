import { Img, Section } from '@react-email/components'
import * as React from 'react'

const SITE_URL = 'https://eclatcentro.com'

/**
 * Encabezado unificado para todos los emails de ÉCLAT.
 * Logo cuadrado (isotipo + ÈCLAT en grande) centrado, 120px de alto.
 */
export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src={`${SITE_URL}/logo-eclat.png`}
        alt="ÈCLAT"
        width="120"
        height="120"
        style={logo}
      />
      <div style={line} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '36px 40px 0',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 24px',
  width: '120px',
  height: '120px',
}

const line: React.CSSProperties = {
  height: '3px',
  background: 'linear-gradient(90deg, #4F7566 0%, #7aab96 50%, #4F7566 100%)',
  borderRadius: '2px',
  margin: '0',
}
