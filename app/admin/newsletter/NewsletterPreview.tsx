'use client'

/**
 * NewsletterPreview — preview visual en tiempo real del newsletter.
 * Simula el diseño real del email (EmailBase + bloques) directamente en el panel admin.
 */

import * as React from 'react'

const SITE_URL = 'https://eclatcentro.com'
const FONT = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"

type BloqueType = 'articulo' | 'formacion' | 'institucional'

interface Bloque {
  id: string
  tipo: BloqueType
  articuloId?: string
  cursoId?: string
  texto?: string
  imagenPreview?: string
  imagenUrl?: string
}

interface Articulo { id: string; title: string; excerpt: string; category: string; image_url?: string | null }
interface Curso { id: string; title: string; description: string; badge: string; badge_type: string; duration?: string; modality?: string; cta?: string | null; link?: string | null }

interface Props {
  asunto: string
  bloques: Bloque[]
  articulos: Articulo[]
  cursos: Curso[]
}

export default function NewsletterPreview({ asunto, bloques, articulos, cursos }: Props) {
  const tieneContenido = asunto.trim() || bloques.some(b =>
    (b.tipo === 'articulo' && b.articuloId) ||
    (b.tipo === 'formacion' && b.cursoId) ||
    (b.tipo === 'institucional' && b.texto?.trim())
  )

  return (
    <div style={{ marginTop: 32 }}>
      {/* Encabezado sección */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: '#E8EDE9' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA8A3', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
          Preview del email
        </span>
        <div style={{ flex: 1, height: 1, background: '#E8EDE9' }} />
      </div>

      {!tieneContenido ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          background: '#F9FAF9', borderRadius: 12, border: '1.5px dashed #D4DDD9',
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✉️</div>
          <p style={{ fontSize: 13, color: '#9CA8A3', margin: 0 }}>
            Completá el asunto y al menos un bloque para ver la preview
          </p>
        </div>
      ) : (
        /* ── Simulación del email ── */
        <div style={{
          background: '#e0e7dc',
          borderRadius: 12,
          padding: '32px 16px',
          fontFamily: FONT,
        }}>
          {/* Card blanca */}
          <div style={{
            maxWidth: 540,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(27,43,38,0.10)',
          }}>
            {/* Header */}
            <div style={{ background: '#fff', padding: '28px 40px 0', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${SITE_URL}/logo-eclat.png`}
                alt="ÉCLAT"
                width={80}
                height={80}
                style={{ display: 'block', margin: '0 auto 22px', width: 80, height: 80, objectFit: 'contain' }}
              />
              <div style={{ height: 4, background: '#e0e7dc', margin: '0 -40px' }} />
            </div>

            {/* Contenido */}
            <div style={{ padding: '32px 40px 28px' }}>
              {/* Saludo */}
              <p style={{ color: '#1B2B26', fontSize: 15, fontWeight: 600, margin: '0 0 16px', fontFamily: FONT }}>
                Hola,
              </p>

              {/* Título / asunto */}
              {asunto.trim() && (
                <p style={{ color: '#1B2B26', fontSize: 22, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2, fontFamily: FONT }}>
                  {asunto}
                </p>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid #D4E0DA', margin: '20px 0' }} />

              {/* Bloques */}
              {bloques.map((bloque, idx) => {
                const art = bloque.tipo === 'articulo' ? articulos.find(a => a.id === bloque.articuloId) : null
                const cur = bloque.tipo === 'formacion' ? cursos.find(c => c.id === bloque.cursoId) : null

                return (
                  <React.Fragment key={bloque.id}>
                    {idx > 0 && <hr style={{ border: 'none', borderTop: '1px solid #E8EDE9', margin: '18px 0' }} />}

                    {/* Artículo */}
                    {bloque.tipo === 'articulo' && (
                      art ? (
                        <div>
                          {art.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={art.image_url} alt={art.title} style={{ width: '100%', borderRadius: 8, marginBottom: 12, display: 'block', maxHeight: 160, objectFit: 'cover' }} />
                          )}
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#4F7566', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px', fontFamily: FONT }}>
                            {art.category}
                          </p>
                          <p style={{ fontSize: 17, fontWeight: 700, color: '#1B2B26', margin: '0 0 8px', lineHeight: 1.3, fontFamily: FONT }}>
                            {art.title}
                          </p>
                          <p style={{ fontSize: 14, color: '#3D4F48', lineHeight: 1.7, margin: '0 0 10px', fontFamily: FONT }}>
                            {art.excerpt}
                          </p>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#2F7D6B', fontFamily: FONT }}>
                            Leer artículo →
                          </span>
                        </div>
                      ) : (
                        <div style={{ background: '#F4F8F6', borderRadius: 8, padding: '14px 16px' }}>
                          <p style={{ fontSize: 13, color: '#9CA8A3', margin: 0, fontFamily: FONT }}>📝 Elegí un artículo para previsualizar</p>
                        </div>
                      )
                    )}

                    {/* Formación */}
                    {bloque.tipo === 'formacion' && (
                      cur ? (
                        <div style={{ background: '#F7FAF8', borderRadius: 10, padding: '18px 20px' }}>
                          <span style={{
                            display: 'inline-block', fontSize: 10, fontWeight: 700,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            padding: '4px 12px', borderRadius: 4,
                            background: cur.badge_type === 'free' ? '#d0e8df' : '#e8ede6',
                            color: cur.badge_type === 'free' ? '#1E5C4A' : '#4F7566',
                            marginBottom: 10,
                          }}>
                            {cur.badge}
                          </span>
                          <p style={{ fontSize: 17, fontWeight: 700, color: '#1B2B26', margin: '0 0 6px', lineHeight: 1.3, fontFamily: FONT }}>
                            {cur.title}
                          </p>
                          {(cur.duration || cur.modality) && (
                            <p style={{ fontSize: 12, color: '#7A9088', margin: '0 0 8px', fontFamily: FONT }}>
                              {[cur.modality, cur.duration].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <p style={{ fontSize: 14, color: '#3D4F48', lineHeight: 1.7, margin: '0 0 14px', fontFamily: FONT }}>
                            {cur.description}
                          </p>
                          <span style={{
                            display: 'inline-block', background: '#1B2B26', color: '#fff',
                            fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                            padding: '10px 24px', borderRadius: 4, fontFamily: FONT,
                          }}>
                            {cur.cta || 'Ver formación'} →
                          </span>
                        </div>
                      ) : (
                        <div style={{ background: '#F4F8F6', borderRadius: 8, padding: '14px 16px' }}>
                          <p style={{ fontSize: 13, color: '#9CA8A3', margin: 0, fontFamily: FONT }}>🎓 Elegí una formación para previsualizar</p>
                        </div>
                      )
                    )}

                    {/* Institucional */}
                    {bloque.tipo === 'institucional' && (
                      bloque.texto?.trim() || bloque.imagenPreview ? (
                        <div>
                          {(bloque.imagenPreview || bloque.imagenUrl) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={bloque.imagenPreview || bloque.imagenUrl}
                              alt="Imagen institucional"
                              style={{ width: '100%', borderRadius: 8, marginBottom: 12, display: 'block', maxHeight: 180, objectFit: 'cover' }}
                            />
                          )}
                          {bloque.texto?.trim() && bloque.texto.split(/\n\n+/).map((p, i) => (
                            <p key={i} style={{ fontSize: 14, color: '#3D4F48', lineHeight: 1.75, margin: '0 0 14px', fontFamily: FONT }}>
                              {p.trim()}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div style={{ background: '#F4F8F6', borderRadius: 8, padding: '14px 16px' }}>
                          <p style={{ fontSize: 13, color: '#9CA8A3', margin: 0, fontFamily: FONT }}>📣 Escribí el mensaje para previsualizar</p>
                        </div>
                      )
                    )}
                  </React.Fragment>
                )
              })}

              {/* Firma */}
              <hr style={{ border: 'none', borderTop: '1px solid #D4E0DA', margin: '24px 0 16px' }} />
              <p style={{ fontSize: 13, color: '#7A9088', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                Un saludo,<br />
                <span style={{ color: '#2F7D6B', fontWeight: 700 }}>Equipo ÉCLAT · Centro de Atención Integral</span>
              </p>
            </div>
          </div>

          {/* Footer fuera de la card */}
          <div style={{ textAlign: 'center', padding: '18px 16px 4px', maxWidth: 540, margin: '0 auto' }}>
            <p style={{ fontSize: 11, color: '#6B8A7E', margin: '0 0 3px', fontFamily: FONT }}>
              eclatcentro.com · WhatsApp · @eclatcentro
            </p>
            <p style={{ fontSize: 10, color: '#8AA89E', margin: 0, letterSpacing: '0.03em', fontFamily: FONT }}>
              Castelli 260, Oncativo, Córdoba · Lun a Vie 8:30 a 20:30 h
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
