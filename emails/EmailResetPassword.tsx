/**
 * EmailResetPassword — link para elegir una contraseña nueva.
 * Diseño unificado con EmailBase.
 */
import { Hr, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

interface Props {
  link: string
}

export default function EmailResetPassword({ link }: Props) {
  return (
    <EmailBase preview="Elegí tu nueva contraseña — ÉCLAT">

      <Text style={styles.saludo}>Hola,</Text>

      <Text style={styles.paragraph}>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta de ÉCLAT.
        Usá el botón de abajo para elegir una nueva:
      </Text>

      <Section style={{ paddingBottom: '8px' }}>
        <Link href={link} style={styles.button}>
          Elegir contraseña nueva →
        </Link>
      </Section>

      <Hr style={styles.dividerSection} />

      <Text style={{ ...styles.paragraph, color: '#9CA8A3', fontSize: '13px' }}>
        El enlace vence en una hora. Si no pediste este cambio, podés ignorar este mail — tu contraseña no cambiará.
      </Text>

      <Text style={styles.firma}>
        Equipo <span style={styles.firmaNombre}>ÉCLAT</span>
      </Text>

    </EmailBase>
  )
}
