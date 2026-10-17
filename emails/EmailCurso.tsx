/**
 * EmailCurso — propuesta de una formación ÉCLAT.
 * Incluye badge, título, metadata, descripción, learnings,
 * precio, CTA y artículos recientes publicados al final.
 */
import { Hr, Img, Link, Section, Text } from '@react-email/components'
import * as React from 'react'
import EmailBase, { styles } from './components/EmailBase'

const BASE = 'https://eclatcentro.com'

interface Curso {
  id: string
  title: string
  description: string
  long_description?: string | null
  badge: string
  badge_type: 'free' | 'soon'
  link?: string | null
  cta?: string | null
  duration?: string
  modality?: string
  level?: string
  learnings?: string | null
  price?: number
  price_original?: number
  is_free?: boolean
}

interface Articulo {
  id: string
  title: string
  excerpt: string
  category: string
  image_url?: string | null
}

interface Props {
  asunto: string
  curso: Curso
  introExtra?: string
  articulos?: Articulo[]          // Artículos recientes al final
  unsubscribeUrl: string
  siteUrl?: string
  nombreDestinatario?: string
}

export default function EmailCurso({
  asunto,
  curso,
  introExtra,
  articulos = [],
  unsubscribeUrl,
  siteUrl = BASE,
  nombreDestinatario,
}: Props) {
  const nombre = nombreDestinatario?.split(' ')[0] || ''
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,'

  const learnings = curso.learnings
    ? curso.learnings.split('\n').map(l => l.trim()).filter(Boolean)
    : []

  const esGratis = curso.is_free || curso.badge_type === 'free'
  const precioDisplay = esGratis
    ? 'Gratuito'
    : curso.price
      ? `$${Number(curso.price).toLocaleString('es-AR')}`
      : null

  const courseUrl = curso.link?.startsWith('http')
    ? curso.link
    : `${siteUrl}/formacion`

  const meta = [curso.modality, curso.duration, curso.level].filter(Boolean).join(' · ')
  const descripcion = (curso.long_description || curso.description || '').trim()

  return (
    <EmailBase preview={asunto} unsubscribeUrl={unsubscribeUrl}>

      {/* Saludo */}
      <Text style={styles.saludo}>{saludo}</Text>

      {/* Badge */}
      <Section style={{ marginBottom: '10px' }}>
        <Text style={styles.badge(curso.badge_type)}>{curso.badge}</Text>
      </Section>

      {/* Título */}
      <Text style={styles.h1}>{curso.title}</Text>

      {/* Meta */}
      {meta && <Text style={styles.metaText}>{meta}</Text>}

      <Hr style={styles.dividerSection} />

      {/* Intro del director */}
      {introExtra?.trim() && (
        <>
          {introExtra.trim().split(/\n\n+/).map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p.trim()}</Text>
          ))}
          <Hr style={styles.dividerSection} />
        </>
      )}

      {/* Descripción */}
      {descripcion.split(/\n\n+/).map((p, i) => (
        <Text key={i} style={styles.paragraph}>{p.trim()}</Text>
      ))}

      {/* Learnings */}
      {learnings.length > 0 && (
        <Section style={styles.greenBox}>
          <Text style={learningsTitle}>En esta formación vas a</Text>
          {learnings.map((l, i) => (
            <Text key={i} style={learningItem}>· {l}</Text>
          ))}
        </Section>
      )}

      {/* Precio */}
      {precioDisplay && (
        <Section style={precioSection}>
          <Text style={precioLabel}>Inversión</Text>
          <Text style={precioValor}>
            {precioDisplay}
            {curso.price_original && !esGratis && (
              <span style={precioOriginal}> ${Number(curso.price_original).toLocaleString('es-AR')}</span>
            )}
          </Text>
        </Section>
      )}

      {/* CTA */}
      <Section style={{ paddingBottom: '8px' }}>
        <Link href={courseUrl} style={styles.button}>
          {curso.cta || 'Ver formación →'}
        </Link>
      </Section>

      {/* Firma */}
      <Hr style={styles.dividerSection} />
      <Text style={styles.firma}>
        Un saludo,{'\n'}
        <span style={styles.firmaNombre}>Equipo ÉCLAT · Centro de Atención Integral</span>
      </Text>

      {/* ── ARTÍCULOS RECIENTES AL FINAL ── */}
      {articulos.length > 0 && (
        <>
          <Hr style={styles.dividerSection} />
          <Text style={styles.sectionTitle}>Del blog de ÉCLAT</Text>

          {articulos.map((art, i) => (
            <Section
              key={art.id}
              style={i > 0 ? { ...artRow, borderTop: '1px solid #E8EDE9' } : artRow}
            >
              {art.image_url && (
                <Img
                  src={art.image_url}
                  alt={art.title}
                  width="500"
                  style={artImage}
                />
              )}
              <Text style={styles.label}>{art.category}</Text>
              <Text style={artTitle}>{art.title}</Text>
              <Text style={artExcerpt}>{art.excerpt}</Text>
              <Link href={`${siteUrl}/publicaciones/${art.id}`} style={styles.readMore}>
                Leer artículo →
              </Link>
            </Section>
          ))}

          <Section style={{ textAlign: 'center', paddingTop: '8px' }}>
            <Link href={`${siteUrl}/publicaciones`} style={styles.buttonSecondary}>
              Ver todas las publicaciones
            </Link>
          </Section>
        </>
      )}

    </EmailBase>
  )
}

const learningsTitle: React.CSSProperties = {
  color: '#2F7D6B',
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 10px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const learningItem: React.CSSProperties = {
  color: '#1d1d1f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 4px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const precioSection: React.CSSProperties = {
  margin: '0 0 24px',
}

const precioLabel: React.CSSProperties = {
  color: '#6e6e73',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  margin: '0 0 4px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const precioValor: React.CSSProperties = {
  color: '#2F7D6B',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.1',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const precioOriginal: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '400',
  color: '#a1a1a6',
  textDecoration: 'line-through',
}

const artRow: React.CSSProperties = {
  paddingTop: '20px',
  paddingBottom: '20px',
}

const artImage: React.CSSProperties = {
  width: '100%',
  borderRadius: '10px',
  marginBottom: '14px',
  display: 'block',
}

const artTitle: React.CSSProperties = {
  color: '#1B2B26',
  fontSize: '16px',
  fontWeight: '700',
  margin: '4px 0 8px',
  lineHeight: '1.3',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}

const artExcerpt: React.CSSProperties = {
  color: '#3a3a3c',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 10px',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}
