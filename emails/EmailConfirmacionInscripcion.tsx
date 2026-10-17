/**
 * EmailConfirmacionInscripcion — confirmación al alumno de que su inscripción llegó.
 * Diseño unificado con EmailBase.
 */
import { Hr, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

const SITE_URL = 'https://eclatcentro.com'

interface Props {
  nombre: string
  courseTitle: string
}

export default function EmailConfirmacionInscripcion({ nombre, courseTitle }: Props) {
  const primerNombre = nombre.split(' ')[0] || nombre

  return (
    <EmailBase preview={`Tu inscripción a ${courseTitle} — ÉCLAT`}>

      <Text style={styles.saludo}>Hola {primerNombre},</Text>

      <Text style={styles.paragraph}>
        Recibimos tu inscripción a <strong style={{ color: '#1B2B26' }}>{courseTitle}</strong>.
        En cuanto confirmemos tu pago, habilitaremos tu acceso a la formación.
      </Text>

      <Text style={styles.paragraph}>
        Podés revisar el estado de tu cuenta desde el siguiente enlace:
      </Text>

      <Section style={{ paddingBottom: '8px' }}>
        <Link href={`${SITE_URL}/mi-cuenta`} style={styles.button}>
          Ir a mi cuenta →
        </Link>
      </Section>

      <Hr style={styles.dividerSection} />

      <Text style={styles.paragraph}>
        Si tenés alguna duda, respondé este mail o escribinos por WhatsApp — estamos para ayudarte.
      </Text>

      <Text style={styles.firma}>
        Un saludo,{'\n'}
        <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
      </Text>

    </EmailBase>
  )
}
