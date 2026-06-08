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

  const paragraphs = (article.content ?? '')
    .split('\n\n')
    .map((p: string) => p.trim())
    .filter(Boolean)

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
              <span>{formatDate(article.created_at)}</span>
              {article.read_time && <span>· {article.read_time}</span>}
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
          {paragraphs.length > 0 ? (
            paragraphs.map((para: string, i: number) => <p key={i}>{para}</p>)
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
