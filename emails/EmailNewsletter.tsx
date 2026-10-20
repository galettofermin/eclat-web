/**
 * EmailNewsletter — newsletter de ÉCLAT.
 * Sistema de bloques: artículo | formación | institucional.
 */
import { Hr, Img, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

const BASE = 'https://eclatcentro.com'
const FONT = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"

/* ── Tipos de bloque ── */
interface BloqueArticulo {
  tipo: 'articulo'
  articulo: {
    id: string
    title: string
    excerpt: string
    category: string
    image_url?: string | null
    author?: string | null
  }
}

interface BloqueFormacion {
  tipo: 'formacion'
  curso: {
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
}

interface BloqueInstitucional {
  tipo: 'institucional'
  texto: string
  label?: string
  imagenUrl?: string
  pdfUrl?: string
  pdfNombre?: string
}

type Bloque = BloqueArticulo | BloqueFormacion | BloqueInstitucional

interface Props {
  asunto: string
  bloques: Bloque[]
  unsubscribeUrl: string
  siteUrl?: string
  nombreDestinatario?: string
}

export default function EmailNewsletter({
  asunto,
  bloques,
  unsubscribeUrl,
  siteUrl = BASE,
  nombreDestinatario,
}: Props) {
  const nombre = nombreDestinatario?.split(' ')[0] || ''
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,'

  return (
    <EmailBase preview={asunto} unsubscribeUrl={unsubscribeUrl}>

      {/* Saludo */}
      <Text style={styles.saludo}>{saludo}</Text>

      {/* Título */}
      <Text style={styles.h1}>{asunto}</Text>

      <Hr style={styles.dividerSection} />

      {/* ── Bloques ── */}
      {bloques.map((bloque, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <Hr style={{ ...styles.dividerSection, margin: '20px 0' }} />}

          {/* Artículo */}
          {bloque.tipo === 'articulo' && (
            <Section style={{ paddingBottom: 8 }}>
              {bloque.articulo.image_url && (
                <Img
                  src={bloque.articulo.image_url}
                  alt={bloque.articulo.title}
                  width="500"
                  style={articleImage}
                />
              )}
              <Text style={styles.label}>{bloque.articulo.category}</Text>
              <Text style={articleTitle}>{bloque.articulo.title}</Text>
              <Text style={styles.paragraph}>{bloque.articulo.excerpt}</Text>
              {bloque.articulo.author && (
                <Text style={authorText}>{bloque.articulo.author}</Text>
              )}
              <Link href={`${siteUrl}/publicaciones/${bloque.articulo.id}`} style={styles.readMore}>
                Leer artículo →
              </Link>
            </Section>
          )}

          {/* Formación */}
          {bloque.tipo === 'formacion' && (() => {
            const c = bloque.curso
            const url = c.link?.startsWith('http') ? c.link : `${siteUrl}/formacion`
            return (
              <Section style={cursoCard}>
                <Text style={styles.badge(c.badge_type)}>{c.badge}</Text>
                <Text style={cursoTitle}>{c.title}</Text>
                {(c.duration || c.modality) && (
                  <Text style={styles.metaText}>
                    {[c.modality, c.duration].filter(Boolean).join(' · ')}
                  </Text>
                )}
                <Text style={styles.paragraph}>{c.description}</Text>
                <Link href={url} style={styles.button}>
                  {c.cta || 'Ver formación'} →
                </Link>
              </Section>
            )
          })()}

          {/* Institucional */}
          {bloque.tipo === 'institucional' && (
            <Section style={{ paddingBottom: 8 }}>
              {bloque.imagenUrl && (
                <Img
                  src={bloque.imagenUrl}
                  alt="ÉCLAT"
                  width="500"
                  style={articleImage}
                />
              )}
              <div style={institucionalBox}>
                {bloque.label && (
                  <Text style={institucionalLabel}>{bloque.label}</Text>
                )}
                {bloque.texto.split(/\n\n+/).map((p, i) => (
                  <Text key={i} style={institucionalText}>{p.trim()}</Text>
                ))}
                {bloque.pdfUrl && (
                  <Link href={bloque.pdfUrl} style={pdfButton}>
                    📄 {bloque.pdfNombre ?? 'Descargar documento'}
                  </Link>
                )}
              </div>
            </Section>
          )}
        </React.Fragment>
      ))}

      {/* Firma */}
      <Hr style={{ ...styles.dividerSection, marginTop: '28px' }} />
      <Text style={styles.firma}>
        Un saludo,{'\n'}
        <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
      </Text>

    </EmailBase>
  )
}

/* ── Estilos ── */
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
  fontFamily: FONT,
}

const authorText: React.CSSProperties = {
  color: '#9CA8A3',
  fontSize: '12px',
  margin: '6px 0 10px',
  fontFamily: FONT,
}

const cursoCard: React.CSSProperties = {
  backgroundColor: '#F7FAF8',
  borderRadius: '10px',
  padding: '20px 24px',
}

const cursoTitle: React.CSSProperties = {
  color: '#1B2B26',
  fontSize: '18px',
  fontWeight: '700',
  margin: '10px 0 6px',
  lineHeight: '1.3',
  fontFamily: FONT,
}

const institucionalBox: React.CSSProperties = {
  backgroundColor: '#F2F6F4',
  borderRadius: '8px',
  padding: '20px 24px',
  borderLeft: '3px solid #2F7D6B',
}

const institucionalLabel: React.CSSProperties = {
  color: '#4F7566',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  margin: '0 0 12px',
  fontFamily: FONT,
}

const institucionalText: React.CSSProperties = {
  color: '#1B2B26',
  fontSize: '15px',
  lineHeight: '1.75',
  margin: '0 0 14px',
  fontFamily: FONT,
}

const pdfButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#ffffff',
  color: '#2F7D6B',
  border: '1.5px solid #2F7D6B',
  borderRadius: '6px',
  padding: '10px 20px',
  fontSize: '13px',
  fontWeight: '700',
  fontFamily: FONT,
  textDecoration: 'none',
  marginTop: '4px',
}
