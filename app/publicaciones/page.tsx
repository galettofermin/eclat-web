'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/lib/types'
import ArticleForm from '@/components/admin/ArticleForm'
import { AnimatedSection } from '@/components/AnimatedSection'
import { StaggerList, StaggerItem } from '@/components/StaggerList'
import { HoverCard } from '@/components/HoverCard'

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
    <div style={{ width: 36, height: 36, border: '3px solid var(--line)', borderTop: '3px solid var(--sage-deep)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
)

export default function PublicacionesPage() {
  const { isAdmin } = useAdmin()
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  const loadArticles = () => {
    setLoadingArticles(true)
    const supabase = createClient()
    supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(
        ({ data }) => { setArticles(data ?? []); setLoadingArticles(false) },
        ()         => { setArticles([]);          setLoadingArticles(false) },
      )
  }

  useEffect(loadArticles, [])

  const openEdit = (a: Article) => setEditingArticle(a)
  const closeEdit = () => setEditingArticle(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este artículo?')) return
    await fetch(`/api/admin/articulos/${id}`, { method: 'DELETE' })
    loadArticles()
  }

  return (
    <>
      <section className="phead">
        <AnimatedSection className="wrap">
          <nav className="crumb"><Link href="/">Inicio</Link>&nbsp;/&nbsp;<b>Publicaciones</b></nav>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1>Pensar la <em>práctica.</em></h1>
              <p className="phead__lede">
                La producción de conocimiento es una dimensión central de la identidad de ÉCLAT.
                Artículos, recursos y materiales sobre salud mental y educación.
              </p>
            </div>
            {isAdmin && (
              <Link
                href="/admin/escritos/nuevo"
                className="btn btn--primary"
                style={{ padding: '11px 22px', fontSize: 14, flexShrink: 0 }}
              >
                + Nuevo artículo
              </Link>
            )}
          </div>
        </AnimatedSection>
      </section>

      <section className="section">
        <div className="wrap">
          {loadingArticles ? (
            <Spinner />
          ) : articles.length === 0 ? (
            <AnimatedSection style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--ink-muted)' }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>Próximamente.</p>
              <p style={{ fontSize: 15 }}>Estamos preparando los primeros artículos.</p>
            </AnimatedSection>
          ) : (
            <StaggerList className="writings">
              {articles.map(a => (
                <StaggerItem key={a.id}>
                <HoverCard className="writing" style={{ position: 'relative' }}>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <button
                        onClick={() => openEdit(a)}
                        style={{ background: 'var(--slate-900)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', cursor: 'pointer' }}
                      >
                        ✏ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        style={{ background: '#c53030', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', cursor: 'pointer' }}
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  )}
                  <h3>
                    <Link href={`/publicaciones/${a.id}`} style={{ color: 'inherit' }}>{a.title}</Link>
                  </h3>
                  <p>{a.excerpt}</p>
                  <span className="writing__meta">
                    <Link href={`/publicaciones/${a.id}`} style={{ color: 'var(--sage-deep)', fontWeight: 700 }}>
                      Leer →
                    </Link>
                  </span>
                </HoverCard>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿Querés escribir con nosotros?</h2>
            <p>Recibimos producciones del equipo y de colegas que quieran compartir su práctica.</p>
          </div>
          <a
            className="btn btn--primary"
            href={`https://wa.me/5493572441454?text=${encodeURIComponent('Hola ÉCLAT, quisiera proponer una publicación.')}`}
            target="_blank" rel="noopener noreferrer"
          >
            Proponer una publicación
          </a>
        </div>
      </section>

      {/* ── Modal edición ── */}
      {editingArticle && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, overflowY: 'auto',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeEdit() }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px 36px',
            width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,.45)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Editar artículo</h2>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink-muted)', lineHeight: 1 }}>✕</button>
            </div>

            <ArticleForm
              key={editingArticle.id}
              article={editingArticle}
              onSaved={() => { closeEdit(); loadArticles() }}
              onCancel={closeEdit}
            />
          </div>
        </div>
      )}
    </>
  )
}
