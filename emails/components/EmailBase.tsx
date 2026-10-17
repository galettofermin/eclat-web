/**
 * EmailBase — estructura base para todos los emails de ÉCLAT.
 * Card blanca redondeada sobre fondo gris, header con logo, footer estándar.
 * Los emails específicos usan este componente y solo aportan el contenido del body.
 */
import { Body, Container, Font, Head, Html, Link, Preview, Section, Text, Hr } from '@react-email/components'
import * as React from 'react'
import EmailHeader from './EmailHeader'

const SITE_URL = 'https://eclatcentro.com'

interface Props {
  preview: string
  unsubscribeUrl?: string
  children: React.ReactNode
}

export default function EmailBase({ preview, unsubscribeUrl, children }: Props) {
  return (
    <Html lang="es">
      <Head>
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NSg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_ck7NSg.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_Lk7NSg.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>

      <Preview>{preview}</Preview>

      <Body style={body}>
        <Container style={container}>

          <EmailHeader />

          <Section style={contentWrapper}>
            {children}
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCenter}>
              <Link href={SITE_URL} style={footerLink}>eclatcentro.com</Link>
              {' · '}
              <Link href="https://wa.link/vyi5uv" style={footerLink}>WhatsApp</Link>
            </Text>
            <Text style={footerAddress}>
              ÉCLAT Centro de Atención Integral · Oncativo, Córdoba
            </Text>
            {unsubscribeUrl && (
              <Text style={unsubText}>
                Recibís este mail porque sos parte de la comunidad ÉCLAT.{' '}
                <Link href={unsubscribeUrl} style={unsubLink}>Desuscribirme</Link>
              </Text>
            )}
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

/* ── Estilos compartidos exportados para uso en los emails hijos ── */

export const styles = {
  h1: {
    color: '#1B2B26',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 8px',
    lineHeight: '1.25',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  h2: {
    color: '#1B2B26',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 16px',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  saludo: {
    color: '#1d1d1f',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  paragraph: {
    color: '#3a3a3c',
    fontSize: '15px',
    lineHeight: '1.75',
    margin: '0 0 18px',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  label: {
    color: '#4F7566',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    margin: '0 0 6px',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  dividerSection: {
    borderColor: '#E8EDE9',
    margin: '28px 0',
  } as React.CSSProperties,

  badge: (type: 'free' | 'soon' | 'default') => ({
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    padding: '3px 10px',
    borderRadius: '20px',
    backgroundColor: type === 'free' ? '#DCEFE8' : '#F0F0F5',
    color: type === 'free' ? '#2F7D6B' : '#6e6e73',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  }) as React.CSSProperties,

  button: {
    backgroundColor: '#2F7D6B',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    padding: '13px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#2F7D6B',
    fontSize: '13px',
    fontWeight: '600',
    padding: '10px 22px',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    border: '1.5px solid #2F7D6B',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  greenBox: {
    backgroundColor: '#EDF3F0',
    borderRadius: '10px',
    padding: '18px 22px',
    margin: '0 0 24px',
  } as React.CSSProperties,

  metaText: {
    color: '#6e6e73',
    fontSize: '13px',
    margin: '0 0 20px',
    lineHeight: '1.5',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  readMore: {
    color: '#2F7D6B',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'none',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  sectionTitle: {
    color: '#1B2B26',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    margin: '0 0 20px',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  firma: {
    color: '#6e6e73',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '24px 0 0',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,

  firmaNombre: {
    color: '#4F7566',
    fontWeight: '600',
    fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  } as React.CSSProperties,
}

/* ── Estilos privados de EmailBase ── */

const body: React.CSSProperties = {
  backgroundColor: '#F2F4F3',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
  margin: '0',
  padding: '0',
}

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '32px auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
}

const contentWrapper: React.CSSProperties = {
  padding: '32px 40px 28px',
}

const divider: React.CSSProperties = {
  borderColor: '#E8EDE9',
  margin: '0',
}

const footer: React.CSSProperties = {
  padding: '20px 40px 28px',
  textAlign: 'center',
}

const footerCenter: React.CSSProperties = {
  color: '#9CA8A3',
  fontSize: '12px',
  margin: '0 0 4px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const footerAddress: React.CSSProperties = {
  color: '#B0B8B4',
  fontSize: '11px',
  margin: '0 0 12px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const footerLink: React.CSSProperties = {
  color: '#9CA8A3',
  textDecoration: 'underline',
}

const unsubText: React.CSSProperties = {
  color: '#C4CECA',
  fontSize: '11px',
  margin: '0',
  lineHeight: '1.5',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const unsubLink: React.CSSProperties = {
  color: '#C4CECA',
  textDecoration: 'underline',
}
