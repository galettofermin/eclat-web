/**
 * EmailHeader — encabezado unificado para todos los emails de ÉCLAT.
 * Logo centrado sobre fondo blanco de la card, línea separadora verde claro.
 */
import { Img, Section } from '@react-email/components'
import * as React from 'react'

const SITE_URL = 'https://eclatcentro.com'

export default function EmailHeader() {
  return (
    <Section style={header}>
      <Img
        src={`${SITE_URL}/logo-eclat.png`}
        alt="ÉCLAT"
        width="100"
        height="100"
        style={logo}
      />
      {/* Separador: franja verde claro igual al fondo exterior */}
      <div style={stripe} />
    </Section>
  )
}

const header: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '32px 44px 0',
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 28px',
  width: '100px',
  height: '100px',
}

const stripe: React.CSSProperties = {
  height: '4px',
  backgroundColor: '#e0e7dc',
  margin: '0',
}
