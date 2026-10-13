import {
  Body, Container, Head, Html,
  Link, Preview, Section, Text, Hr, Img,
} from '@react-email/components'
import * as React from 'react'

interface Articulo {
  id: string
  title: string
  excerpt: string
  category: string
  image_url?: string | null
  author?: string | null
}

interface Props {
  asunto: string
  intro?: string
  articulos: Articulo[]
  unsubscribeUrl: string
  siteUrl?: string
}

const BASE = 'https://eclatcentro.com'

export default function EmailNewsletter({ asunto, intro, articulos, unsubscribeUrl, siteUrl = BASE }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{asunto}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ÉCLAT</Text>
            <Text style={tagline}>Centro de Atención Integral · Oncativo</Text>
          </Section>

          <Section style={content}>

            {/* Título del envío */}
            <Text style={h1}>{asunto}</Text>

            {/* Intro opcional */}
            {intro && <Text style={paragraph}>{intro}</Text>}

            <Hr style={innerDivider} />

            {/* Artículos */}
            {articulos.map((art, i) => (
              <Section key={art.id} style={i > 0 ? { ...articleSection, borderTop: '1px solid #E8EDE9' } : articleSection}>
                {art.image_url && (
                  <Img
                    src={art.image_url}
                    alt={art.title}
                    width="480"
                    style={articleImage}
                  />
                )}
                <Text style={categoryBadge}>{art.category}</Text>
                <Text style={articleTitle}>{art.title}</Text>
                <Text style={articleExcerpt}>{art.excerpt}</Text>
                {art.author && <Text style={articleAuthor}>{art.author}</Text>}
                <Link href={`${siteUrl}/publicaciones/${art.id}`} style={readMoreLink}>
                  Leer artículo →
                </Link>
              </Section>
            ))}

            <Hr style={innerDivider} />

            {/* CTA formaciones */}
            <Section style={ctaSection}>
              <Text style={ctaText}>¿Querés seguir formándote?</Text>
              <Link href={`${siteUrl}/formacion`} style={button}>
                Ver formaciones disponibles
              </Link>
            </Section>

          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>ÉCLAT Centro de Atención Integral · Oncativo, Córdoba</Text>
            <Text style={footerText}>
              <Link href={siteUrl} style={footerLink}>eclatcentro.com</Link>
              {' · '}
              <Link href="https://wa.link/vyi5uv" style={footerLink}>WhatsApp</Link>
            </Text>
            <Text style={unsubText}>
              Recibís este mail porque sos parte de la comunidad ÉCLAT.{' '}
              <Link href={unsubscribeUrl} style={unsubLink}>Desuscribirme</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#F5F5F5', fontFamily: 'Georgia, serif' }

const container = {
  maxWidth: '560px', margin: '32px auto',
  backgroundColor: '#FFFFFF', borderRadius: '8px',
  overflow: 'hidden' as const,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const header = {
  backgroundColor: '#1B2B26', padding: '28px 40px',
  textAlign: 'center' as const,
}

const logo = { color: '#FFFFFF', fontSize: '24px', fontWeight: '600', margin: '0', letterSpacing: '-0.5px' }
const tagline = { color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' as const }

const content = { padding: '36px 40px 28px' }

const h1 = { color: '#1B2B26', fontSize: '22px', fontWeight: '500', margin: '0 0 16px', lineHeight: '1.3' }
const paragraph = { color: '#4B6B5E', fontSize: '15px', lineHeight: '1.75', margin: '0 0 20px' }

const innerDivider = { borderColor: '#E8EDE9', margin: '24px 0' }

const articleSection = { paddingTop: '20px', paddingBottom: '20px' }
const articleImage = { width: '100%', borderRadius: '6px', marginBottom: '14px', display: 'block' }
const categoryBadge = { color: '#2F7D6B', fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase' as const, margin: '0 0 6px' }
const articleTitle = { color: '#1B2B26', fontSize: '18px', fontWeight: '600', margin: '0 0 8px', lineHeight: '1.35' }
const articleExcerpt = { color: '#4B6B5E', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }
const articleAuthor = { color: '#9CA8A3', fontSize: '12px', margin: '0 0 12px' }
const readMoreLink = { color: '#2F7D6B', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }

const ctaSection = { textAlign: 'center' as const, padding: '8px 0 16px' }
const ctaText = { color: '#4B6B5E', fontSize: '15px', margin: '0 0 16px' }

const button = {
  backgroundColor: '#2F7D6B', color: '#FFFFFF',
  fontSize: '14px', fontWeight: '500',
  padding: '12px 28px', borderRadius: '4px',
  textDecoration: 'none', display: 'inline-block',
}

const divider = { borderColor: '#E8EDE9', margin: '0' }
const footer = { padding: '20px 40px', textAlign: 'center' as const }
const footerText = { color: '#9CA8A3', fontSize: '12px', margin: '4px 0' }
const footerLink = { color: '#9CA8A3', textDecoration: 'underline' }
const unsubText = { color: '#C4CECA', fontSize: '11px', margin: '12px 0 0', lineHeight: '1.5' }
const unsubLink = { color: '#C4CECA', textDecoration: 'underline' }
