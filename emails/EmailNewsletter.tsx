/**
 * EmailNewsletter — newsletter de ÉCLAT.
 * Modos: artículos publicados | escrito propio.
 * Al final muestra los cursos activos disponibles.
 */
import { Hr, Img, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

const BASE = 'https://eclatcentro.com'

interface Articulo {
  id: string
  title: string
  excerpt: string
  category: string
  image_url?: string | null
  author?: string | null
}

interface Curso {
  id: string
  title: string
  description: string
  badge: string
  badge_type: 'free' | 'soon'
  link?: string | null
  cta?: string | null
  duration?: string
  modality?: string
}

interface Props {
  asunto: string
  contenido?: string          // Modo escrito
  intro?: string              // Intro para modo artículos
  articulos?: Articulo[]
  cursos?: Curso[]            // Cursos a mostrar al final
  unsubscribeUrl: string
  siteUrl?: string
  nombreDestinatario?: string
}

export default function EmailNewsletter({
  asunto,
  contenido,
  intro,
  articulos = [],
  cursos = [],
  unsubscribeUrl,
  siteUrl = BASE,
  nombreDestinatario,
}: Props) {
  const nombre = nombreDestinatario?.split(' ')[0] || ''
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,'
  const modoEscrito = !!contenido?.trim()

  return (
    <EmailBase preview={asunto} unsubscribeUrl={unsubscribeUrl}>

      {/* Saludo */}
      <Text style={styles.saludo}>{saludo}</Text>

      {/* Título */}
      <Text style={styles.h1}>{asunto}</Text>

      <Hr style={styles.dividerSection} />

      {modoEscrito ? (
        /* ── MODO ESCRITO ── */
        <>
          {contenido!.split(/\n\n+/).map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p.trim()}</Text>
          ))}

          {/* Firma */}
          <Text style={styles.firma}>
            Un saludo,{'\n'}
            <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
          </Text>
        </>
      ) : (
        /* ── MODO ARTÍCULOS ── */
        <>
          {intro?.trim() && (
            <Text style={styles.paragraph}>{intro}</Text>
          )}

          {articulos.map((art, i) => (
            <Section
              key={art.id}
              style={i > 0 ? { ...articleSection, borderTop: '1px solid #E8EDE9' } : articleSection}
            >
              {art.image_url && (
                <Img
                  src={art.image_url}
                  alt={art.title}
                  width="500"
                  style={articleImage}
                />
              )}
              <Text style={styles.label}>{art.category}</Text>
              <Text style={articleTitle}>{art.title}</Text>
              <Text style={styles.paragraph}>{art.excerpt}</Text>
              {art.author && <Text style={authorText}>{art.author}</Text>}
              <Link href={`${siteUrl}/publicaciones/${art.id}`} style={styles.readMore}>
                Leer artículo →
              </Link>
            </Section>
          ))}

          {/* Firma */}
          <Hr style={{ ...styles.dividerSection, marginTop: '28px' }} />
          <Text style={styles.firma}>
            Un saludo,{'\n'}
            <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
          </Text>
        </>
      )}

      {/* ── CURSOS AL FINAL ── */}
      {cursos.length > 0 && (
        <>
          <Hr style={styles.dividerSection} />
          <Text style={styles.sectionTitle}>Formaciones disponibles</Text>

          {cursos.map((curso) => {
            const url = curso.link?.startsWith('http') ? curso.link : `${siteUrl}/formacion`
            return (
              <Section key={curso.id} style={cursoRow}>
                <Section style={cursoBadgeRow}>
                  <Text style={styles.badge(curso.badge_type)}>{curso.badge}</Text>
                </Section>
                <Text style={cursoTitle}>{curso.title}</Text>
                <Text style={cursoDesc}>{curso.description}</Text>
                {(curso.duration || curso.modality) && (
                  <Text style={styles.metaText}>
                    {[curso.modality, curso.duration].filter(Boolean).join(' · ')}
                  </Text>
                )}
                <Link href={url} style={styles.readMore}>
                  {curso.cta || 'Ver formación →'}
                </Link>
              </Section>
            )
          })}

          <Section style={{ textAlign: 'center', paddingTop: '8px' }}>
            <Link href={`${siteUrl}/formacion`} style={styles.buttonSecondary}>
              Ver todas las formaciones
            </Link>
          </Section>
        </>
      )}

    </EmailBase>
  )
}

const articleSection: React.CSSProperties = {
  paddingTop: '24px',
  paddingBottom: '24px',
}

const articleImage: React.CSSProperties = {
  width: '100%',
  borderRadius: '10px',
  marginBottom: '16px',
  display: 'block',
}

const articleTitle: React.CSSProperties = {
  color: '#1B2B26',
  fontSize: '19px',
  fontWeight: '700',
  margin: '4px 0 10px',
  lineHeight: '1.3',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const authorText: React.CSSProperties = {
  color: '#9CA8A3',
  fontSize: '12px',
  margin: '6px 0 10px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const cursoRow: React.CSSProperties = {
  backgroundColor: '#F7FAF8',
  borderRadius: '10px',
  padding: '18px 20px',
  marginBottom: '12px',
}

const cursoBadgeRow: React.CSSProperties = {
  marginBottom: '8px',
}

const cursoTitle: React.CSSProperties = {
  color: '#1B2B26',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 6px',
  lineHeight: '1.3',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const cursoDesc: React.CSSProperties = {
  color: '#3a3a3c',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 10px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}
