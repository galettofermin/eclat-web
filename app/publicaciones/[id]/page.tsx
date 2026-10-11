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

function renderContent(content: string) {
  const blocks = content.split('\n\n').filter(b => b.trim());

  return blocks.map((block, i) => {
    const text = block.trim();

    // Pregunta retórica (termina en ?)
    if (text.endsWith('?')) {
      return <p key={i} className="article-quote">{text}</p>;
    }

    // Referencias (empieza con "Referencias")
    if (text.startsWith('Referencias')) {
      return (
        <div key={i} className="article-references">
          <p className="ref-title">Referencias conceptuales</p>
          {text.split('\n').slice(1).map((ref, j) => (
            <p key={j}>{ref}</p>
          ))}
        </div>
      );
    }

    // Firma final (empieza con "Lic.")
    if (text.startsWith('Lic.') && i > blocks.length - 5) {
      return (
        <div key={i} style={{
          marginTop: '56px', paddingTop: '32px', borderTop: '1px solid var(--line)',
          background: 'var(--sage-50)', borderRadius: '12px', padding: '24px 28px'
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
    }

    // Párrafo normal (estilos en .article-body p)
    return <p key={i}>{text}</p>;
  });
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
    </>
  )
}
