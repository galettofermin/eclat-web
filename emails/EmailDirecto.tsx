/**
 * EmailDirecto — email personalizado desde el panel de Comunidad.
 * Diseño limpio con saludo por nombre, cuerpo libre y firma ÉCLAT.
 */
import { Hr, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

interface Props {
  asunto: string
  mensaje: string
  nombreDestinatario?: string
}

export default function EmailDirecto({ asunto, mensaje, nombreDestinatario }: Props) {
  const nombre = nombreDestinatario?.split(' ')[0] || ''
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,'

  const parrafos = mensaje
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <EmailBase preview={asunto}>

      {/* Saludo */}
      <Text style={styles.saludo}>{saludo}</Text>

      {/* Cuerpo */}
      {parrafos.map((p, i) => (
        <Text key={i} style={styles.paragraph}>{p}</Text>
      ))}

      {/* Firma */}
      <Hr style={styles.dividerSection} />
      <Text style={styles.firma}>
        Un saludo,{'\n'}
        <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
      </Text>

      {/* Recordatorio de qué es ÉCLAT (para quien recibe por primera vez) */}
      <Section style={aboutBox}>
        <Text style={aboutText}>
          ÉCLAT es un centro de atención integral en Oncativo, Córdoba, que ofrece servicios de psicología, fonoaudiología, psicomotricidad y psicopedagogía.
        </Text>
      </Section>

    </EmailBase>
  )
}

const aboutBox: React.CSSProperties = {
  backgroundColor: '#F7FAF8',
  borderRadius: '8px',
  padding: '14px 18px',
  marginTop: '8px',
}

const aboutText: React.CSSProperties = {
  color: '#9CA8A3',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}
