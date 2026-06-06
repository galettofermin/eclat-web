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
      title: data?.title ? `${data.title} · ÉCLAT` : 'Artículo · ÉCLAT',
      description: data?.excerpt ?? '',
    }
  } catch {
    return { title: 'Artículo · ÉCLAT' }
  }
}

export default async function ArticlePage({ params }: Props) {
  let article = null
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .eq('published', true)
      .single()
    article = data
  } catch {
    notFound()
  }

  if (!article) notFound()

  return (
    <>
      {/* ← Volver */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper)' }}>
        <div className="wrap" style={{ paddingBlock: '14px' }}>
          <Link
            href="/publicaciones"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--sage-deep)' }}
          >
            ← Volver a publicaciones
          </Link>
        </div>
      </div>

      {/* Hero imagen */}
      {article.image_url ? (
        <div style={{ position: 'relative', height: 'clamp(240px,40vw,480px)', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 55%, transparent 100%)',
          }} />
          <div className="wrap" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 'clamp(24px,4vw,48px)' }}>
            <span style={{
              display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '.16em',
              textTransform: 'uppercase', color: 'var(--sage)', marginBottom: 10,
            }}>
              {article.category}
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(26px,4vw,52px)', maxWidth: '18ch', lineHeight: 1.1 }}>
              {article.title}
            </h1>
          </div>
        </div>
      ) : (
        <section className="phead">
          <div className="wrap">
            <span className="kicker">{article.category}</span>
            <h1 style={{ marginTop: 14 }}>{article.title}</h1>
          </div>
        </section>
      )}

      {/* Contenido */}
      <article style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(36px,5vw,64px) clamp(16px,5vw,24px)' }}>
        {/* Excerpt en serif italic */}
        {article.excerpt && (
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px,2.2vw,22px)',
            lineHeight: 1.55,
            color: 'var(--slate-700)',
            marginBottom: 36,
            borderLeft: '3px solid var(--sage)',
            paddingLeft: 20,
          }}>
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--ink-muted)', marginBottom: 36, flexWrap: 'wrap' }}>
          <span>{new Date(article.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {article.read_time && <span>· {article.read_time}</span>}
        </div>

        {/* Body */}
        <div style={{ fontSize: 19, lineHeight: 1.8, color: 'var(--slate-700)' }}>
          {(article.content ?? '').split('\n').map((para: string, i: number) =>
            para.trim() ? (
              <p key={i} style={{ marginBottom: '1.4em' }}>{para}</p>
            ) : (
              <div key={i} style={{ height: '0.6em' }} />
            )
          )}
        </div>

        {/* Separador */}
        <div style={{ borderTop: '1px solid var(--line)', marginTop: 48, paddingTop: 28 }}>
          <Link
            href="/publicaciones"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--sage-deep)' }}
          >
            ← Volver a publicaciones
          </Link>
        </div>
      </article>
    </>
  )
}
