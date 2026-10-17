import * as React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: { id: string } }

const SITE_URL = 'https://eclatcentro.com'
const OG_FALLBACK = { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('title, excerpt, image_url, author, created_at')
      .eq('id', params.id)
      .eq('published', true)
      .single()

    if (!data) return { title: 'Artículo' }

    // El layout raíz ya agrega " · ÉCLAT" al <title>; en OG/Twitter va completo
    const shareTitle = `${data.title} · ÉCLAT`
    const description = data.excerpt || 'Artículo del equipo de ÉCLAT Centro de Atención Integral, Oncativo, Córdoba.'
    const url = `${SITE_URL}/publicaciones/${params.id}`
    // Las portadas tienen tamaños variables: no declaramos width/height para no mentirle a las plataformas
    const image = data.image_url
      ? { url: data.image_url, alt: data.title }
      : { ...OG_FALLBACK, alt: data.title }

    return {
      title: data.title,
      description,
      openGraph: {
        title: shareTitle,
        description,
        url,
        siteName: 'ÉCLAT Centro de Atención Integral',
        images: [image],
        type: 'article',
        publishedTime: data.created_at,
        authors: data.author ? [data.author] : ['ÉCLAT'],
        locale: 'es_AR',
      },
      twitter: {
        card: 'summary_large_image',
        title: shareTitle,
        description,
        images: [image.url],
      },
      alternates: { canonical: url },
    }
  } catch {
    return { title: 'Artículo' }
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Comienzos de párrafo que marcan el cierre reflexivo del texto
const CLOSING_STARTS = ['Y ', 'Porque ', 'Tal vez']
// Párrafos de presentación (desde dónde se piensa el tema)
const INTRO_STARTS = ['Desde el psicoanálisis', 'Desde el Centro', 'Desde una orientación']

function renderContent(content: string) {
  const blocks = content.split('\n\n').map(b => b.trim()).filter(Boolean);
  const out: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const text = blocks[i];

    // Pregunta retórica (termina en ?)
    if (text.endsWith('?')) {
      out.push(<p key={i} className="article-quote">{text}</p>);
      continue;
    }

    // Párrafo de cierre poético
    if (CLOSING_STARTS.some(s => text.startsWith(s))) {
      out.push(<p key={i} className="article-closing">{text}</p>);
      continue;
    }

    // Párrafo de presentación (disciplina o institución)
    if (INTRO_STARTS.some(s => text.startsWith(s))) {
      out.push(<p key={i} className="article-intro">{text}</p>);
      continue;
    }

    // Referencias: las líneas del mismo bloque y los bloques siguientes
    // (cada referencia suele venir separada por una línea en blanco) hasta la firma
    if (text.startsWith('Referencias')) {
      const refs = text.split('\n').slice(1).map(l => l.trim()).filter(Boolean);
      while (i + 1 < blocks.length && !blocks[i + 1].startsWith('Lic.')) {
        refs.push(...blocks[++i].split('\n').map(l => l.trim()).filter(Boolean));
      }
      out.push(
        <div key={i} className="article-references">
          <p className="ref-title">Referencias conceptuales</p>
          {refs.map((ref, j) => (
            <p key={j}>{ref}</p>
          ))}
        </div>
      );
      continue;
    }

    // Firma final
    if (text.startsWith('Lic.') && i > blocks.length - 5) {
      out.push(
        <div key={i} style={{
          marginTop: '56px', background: 'var(--sage-50)',
          borderRadius: '12px', padding: '24px 28px'
        }}>
          {text.split('\n').map((line, j) => (
            <p key={j} style={{
              fontSize: j === 0 ? '15px' : '13.5px',
              fontWeight: j === 0 ? 600 : 400,
              color: j === 0 ? 'var(--slate-900)' : 'var(--ink-muted)',
              marginBottom: '3px'
            }}>{line}</p>
          ))}
        </div>
      );
      continue;
    }

    // Párrafo normal (estilos en .article-body p)
    out.push(<p key={i}>{text}</p>);
  }

  return out;
}

export default async function ArticlePage({ params }: Props) {
  const supabase = createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .eq('published', true)
    .single()

  if (!article) notFound()

  const { data: related } = await supabase
    .from('articles')
    .select('id, title, excerpt')
    .eq('published', true)
    .neq('id', params.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, description, badge, badge_type, link, cta, duration, modality')
    .eq('published', true)
    .order('sort_order')
    .limit(3)

  const content: string = article.content ?? ''
  const imageUrl: string = article.image_url?.trim() ?? ''
  const author: string = article.author ?? ''
  const authorRole: string = article.author_role ?? ''
  const initials = author
    .replace(/^(Lic|Dra?|Mg|Prof)\.\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('')

  return (
    <>
      {/* Hero */}
      <section className={`article-hero${imageUrl ? '' : ' article-hero--noimg'}`}>
        <div className="wrap">
          {/* Columna izquierda */}
          <div>
            <Link href="/publicaciones" className="article-back">
              ← Volver a publicaciones
            </Link>
            <h1 className="article-title">{article.title}</h1>
            {article.subtitle && (
              <p className="article-subtitle">{article.subtitle}</p>
            )}
            {/* La fecha va en la tarjeta de autora; acá solo si no hay autor */}
            {!author && (
              <div className="article-meta">
                <span>{formatDate(article.created_at)}</span>
              </div>
            )}
          </div>

          {/* Columna derecha — imagen (sin imagen, el título va a lo ancho) */}
          {imageUrl && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={article.title}
                className="article-image"
              />
            </div>
          )}
        </div>
      </section>

      {/* Cuerpo */}
      <div className="wrap">
        <div className="article-body">
          {author && (
          <div className="article-author">
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--green-700)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', fontWeight: 700,
              color: '#fff', flexShrink: 0
            }}>{initials}</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--slate-900)' }}>{author}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{authorRole}</div>
            </div>
            <div className="article-author__date">{formatDate(article.created_at)}</div>
          </div>
          )}
          {content.trim() ? (
            renderContent(content)
          ) : (
            <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              Contenido próximamente.
            </p>
          )}
        </div>
      </div>

      {/* Relacionados */}
      {related && related.length > 0 && (
        <section className="article-related">
          <div className="wrap">
            <span className="kicker">Seguir leyendo</span>
            <h2 style={{ marginTop: 10, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Otros escritos del centro
            </h2>
            <div className="article-related-grid">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/publicaciones/${a.id}`}
                  className="article-card"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="article-card__body">
                    <p className="article-card__title">{a.title}</p>
                    {a.excerpt && <p className="article-card__excerpt">{a.excerpt}</p>}
                    <span className="article-card__link">Leer →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Formaciones */}
      {courses && courses.length > 0 && (
        <section style={{
          padding: 'clamp(48px,7vw,80px) 0',
          background: 'var(--sage-50, #F4F8F6)',
        }}>
          <div className="wrap">
            <span className="kicker">Formación ÉCLAT</span>
            <h2 style={{ marginTop: 10, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Formaciones disponibles
            </h2>
            <div style={{ marginTop: 32, display: 'grid', gap: 16 }}>
              {courses.map((c) => {
                const href = c.link?.startsWith('http') ? c.link : '/formacion'
                const meta = [c.modality, c.duration].filter(Boolean).join(' · ')
                return (
                  <Link
                    key={c.id}
                    href={href}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{
                      background: '#fff',
                      borderRadius: 14,
                      padding: '22px 26px',
                      border: '1px solid #E2EBE6',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 20,
                      transition: 'box-shadow .2s',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Badge */}
                        <span style={{
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: c.badge_type === 'free' ? '#DCEFE8' : '#F0F0F5',
                          color: c.badge_type === 'free' ? '#2F7D6B' : '#6e6e73',
                          marginBottom: 8,
                        }}>{c.badge}</span>

                        <p style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: 'var(--slate-900, #1B2B26)',
                          margin: '0 0 6px',
                          lineHeight: 1.3,
                        }}>{c.title}</p>

                        {meta && (
                          <p style={{
                            fontSize: 12,
                            color: 'var(--ink-muted, #6e6e73)',
                            margin: '0 0 8px',
                          }}>{meta}</p>
                        )}

                        <p style={{
                          fontSize: 14,
                          color: 'var(--ink-secondary, #3a3a3c)',
                          margin: 0,
                          lineHeight: 1.55,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        } as React.CSSProperties}>{c.description}</p>
                      </div>

                      <span style={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#2F7D6B',
                        whiteSpace: 'nowrap',
                        paddingTop: 2,
                      }}>
                        {c.cta || 'Ver formación'} →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/formacion" style={{
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 600,
                color: '#2F7D6B',
                textDecoration: 'none',
                padding: '10px 22px',
                border: '1.5px solid #2F7D6B',
                borderRadius: 8,
              }}>
                Ver todas las formaciones →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
