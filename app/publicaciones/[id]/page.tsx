import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('title, excerpt')
      .eq('id', params.id)
      .eq('published', true)
      .single()
    return {
      title: data?.title ?? 'Artículo · ÉCLAT',
      description: data?.excerpt ?? '',
    }
  } catch {
    return { title: 'Artículo · ÉCLAT' }
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
      return (
        <p key={i} style={{
          fontSize: '21px', fontStyle: 'italic', color: 'var(--slate-900)',
          fontWeight: 500, margin: '32px 0', paddingLeft: '24px',
          borderLeft: '3px solid var(--sage)', lineHeight: 1.6
        }}>{text}</p>
      );
    }

    // Referencias (empieza con "Referencias")
    if (text.startsWith('Referencias')) {
      return (
        <div key={i} style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--line)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--sage-deep)', marginBottom: '16px' }}>Referencias conceptuales</p>
          {text.split('\n').slice(1).map((ref, j) => (
            <p key={j} style={{ fontSize: '15px', color: 'var(--ink-muted)', marginBottom: '8px' }}>{ref}</p>
          ))}
        </div>
      );
    }

    // Firma final (empieza con "Lic.")
    if (text.startsWith('Lic.') && i > blocks.length - 5) {
      return (
        <div key={i} style={{
          marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          {text.split('\n').map((line, j) => (
            <p key={j} style={{ fontSize: j === 0 ? '16px' : '14px', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--slate-900)' : 'var(--ink-muted)' }}>{line}</p>
          ))}
        </div>
      );
    }

    // Párrafo normal
    return (
      <p key={i} style={{
        fontSize: '19px', lineHeight: 1.85, color: 'var(--slate-700)',
        marginBottom: '24px'
      }}>{text}</p>
    );
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
    .select('id, title, category, image_url')
    .eq('published', true)
    .neq('id', params.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const content: string = article.content ?? ''
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
      <section className="article-hero">
        <div className="wrap">
          {/* Columna izquierda */}
          <div>
            <Link href="/publicaciones" className="article-back">
              ← Volver a publicaciones
            </Link>
            <span className="article-category">{article.category}</span>
            <h1 className="article-title">{article.title}</h1>
            {article.subtitle && (
              <p className="article-subtitle">{article.subtitle}</p>
            )}
            <div className="article-meta">
              {/* La fecha va en la tarjeta de autora; acá solo si no hay autor */}
              {!author && <span>{formatDate(article.created_at)}</span>}
              {article.read_time && <span>{author ? '' : '· '}{article.read_time}</span>}
            </div>
          </div>

          {/* Columna derecha — imagen */}
          <div>
            {article.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image_url}
                alt={article.title}
                className="article-image"
              />
            ) : (
              <div className="article-image-placeholder">Sin imagen</div>
            )}
          </div>
        </div>
      </section>

      {/* Cuerpo */}
      <div className="wrap">
        <div className="article-body">
          {author && (
          <div className="article-author">
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--sage)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', fontWeight: 700,
              color: 'var(--slate-900)', flexShrink: 0
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
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt={a.title} className="article-card__img" />
                  ) : (
                    <div className="article-card__img" />
                  )}
                  <div className="article-card__body">
                    <span className="article-card__cat">{a.category}</span>
                    <p className="article-card__title">{a.title}</p>
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
