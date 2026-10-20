/**
 * EmailBase — estructura base para todos los emails de ÉCLAT.
 * Fondo verde claro #e0e7dc, card blanca, tipografía DM Sans (grotesca moderna).
 * Los emails específicos usan este componente y solo aportan el contenido del body.
 */
import { Body, Container, Font, Head, Html, Link, Preview, Section, Text, Hr } from '@react-email/components'
import * as React from 'react'
import EmailHeader from './EmailHeader'

const SITE_URL = 'https://eclatcentro.com'

// Fuente principal: DM Sans (grotesca geométrica, la más cercana a Lab Grotesque disponible en woff2)
const FONT = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"

interface Props {
  preview: string
  unsubscribeUrl?: string
  children: React.ReactNode
}

export default function EmailBase({ preview, unsubscribeUrl, children }: Props) {
  return (
    <Html lang="es">
      <Head>
        {/* DM Sans 400 */}
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CnssC2u.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        {/* DM Sans 500 */}
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8Cm8sC2u.woff2',
            format: 'woff2',
          }}
          fontWeight={500}
          fontStyle="normal"
        />
        {/* DM Sans 700 */}
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmusC2u.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>

      <Preview>{preview}</Preview>

      <Body style={body}>
        {/* Wrapper exterior verde claro */}
        <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={outerTable}>
          <tbody>
            <tr>
              <td style={outerCell}>

                <Container style={container}>
                  <EmailHeader />

                  <Section style={contentWrapper}>
                    {children}
                  </Section>
                </Container>

                {/* Footer fuera de la card, sobre el verde */}
                <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
                  <tbody>
                    <tr>
                      <td style={footerOuter}>
                        <Text style={footerLinks}>
                          <Link href={SITE_URL} style={footerLink}>eclatcentro.com</Link>
                          {'  ·  '}
                          <Link href="https://wa.link/vyi5uv" style={footerLink}>WhatsApp</Link>
                          {'  ·  '}
                          <Link href="https://instagram.com/eclatcentro" style={footerLink}>@eclatcentro</Link>
                        </Text>
                        <Text style={footerAddress}>
                          Castelli 260, Oncativo, Córdoba · Lun a Vie 8:30 a 20:30 h
                        </Text>
                        {unsubscribeUrl && (
                          <Text style={unsubText}>
                            Recibís este mail porque sos parte de la comunidad ÉCLAT.{' '}
                            <Link href={unsubscribeUrl} style={unsubLink}>Desuscribirme</Link>
                          </Text>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  )
}

/* ── Estilos compartidos exportados para uso en los emails hijos ── */

export const styles = {
  h1: {
    color: '#1B2B26',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 10px',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontFamily: FONT,
  } as React.CSSProperties,

  h2: {
    color: '#1B2B26',
    fontSize: '17px',
    fontWeight: '700',
    margin: '0 0 14px',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontFamily: FONT,
  } as React.CSSProperties,

  saludo: {
    color: '#1B2B26',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.6',
    margin: '0 0 18px',
    fontFamily: FONT,
  } as React.CSSProperties,

  paragraph: {
    color: '#3D4F48',
    fontSize: '15px',
    lineHeight: '1.75',
    margin: '0 0 18px',
    fontFamily: FONT,
  } as React.CSSProperties,

  label: {
    color: '#4F7566',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    margin: '0 0 6px',
    fontFamily: FONT,
  } as React.CSSProperties,

  dividerSection: {
    borderColor: '#D4E0DA',
    margin: '28px 0',
  } as React.CSSProperties,

  badge: (type: 'free' | 'soon' | 'default') => ({
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    padding: '4px 12px',
    borderRadius: '4px',
    backgroundColor: type === 'free' ? '#d0e8df' : '#e8ede6',
    color: type === 'free' ? '#1E5C4A' : '#4F7566',
    fontFamily: FONT,
  }) as React.CSSProperties,

  button: {
    backgroundColor: '#1B2B26',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    padding: '14px 32px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: FONT,
  } as React.CSSProperties,

  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#2F7D6B',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '11px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    border: '1.5px solid #2F7D6B',
    fontFamily: FONT,
  } as React.CSSProperties,

  greenBox: {
    backgroundColor: '#e8f0ec',
    borderRadius: '6px',
    padding: '20px 24px',
    margin: '0 0 24px',
  } as React.CSSProperties,

  metaText: {
    color: '#7A9088',
    fontSize: '13px',
    margin: '0 0 20px',
    lineHeight: '1.5',
    fontFamily: FONT,
  } as React.CSSProperties,

  readMore: {
    color: '#2F7D6B',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    fontFamily: FONT,
  } as React.CSSProperties,

  sectionTitle: {
    color: '#4F7566',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    margin: '0 0 20px',
    fontFamily: FONT,
  } as React.CSSProperties,

  firma: {
    color: '#7A9088',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '24px 0 0',
    fontFamily: FONT,
  } as React.CSSProperties,

  firmaNombre: {
    color: '#2F7D6B',
    fontWeight: '700',
    fontFamily: FONT,
  } as React.CSSProperties,
}

/* ── Estilos privados de EmailBase ── */

const body: React.CSSProperties = {
  backgroundColor: '#e0e7dc',
  fontFamily: FONT,
  margin: '0',
  padding: '0',
}

const outerTable: React.CSSProperties = {
  backgroundColor: '#e0e7dc',
  margin: '0',
  padding: '0',
}

const outerCell: React.CSSProperties = {
  backgroundColor: '#e0e7dc',
  padding: '40px 20px 32px',
}

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '6px',
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(27,43,38,0.10)',
}

const contentWrapper: React.CSSProperties = {
  padding: '36px 44px 32px',
}

const footerOuter: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '24px 44px 0',
  textAlign: 'center',
}

const footerLinks: React.CSSProperties = {
  color: '#6B8A7E',
  fontSize: '12px',
  margin: '0 0 4px',
  fontFamily: FONT,
}

const footerAddress: React.CSSProperties = {
  color: '#8AA89E',
  fontSize: '11px',
  margin: '0 0 12px',
  letterSpacing: '0.04em',
  fontFamily: FONT,
}

const footerLink: React.CSSProperties = {
  color: '#4F7566',
  textDecoration: 'none',
  fontWeight: '500',
}

const unsubText: React.CSSProperties = {
  color: '#9DBDB4',
  fontSize: '11px',
  margin: '0',
  lineHeight: '1.5',
  fontFamily: FONT,
}

const unsubLink: React.CSSProperties = {
  color: '#9DBDB4',
  textDecoration: 'underline',
}
