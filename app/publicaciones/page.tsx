'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/lib/types'
import { AnimatedSection } from '@/components/AnimatedSection'
import { StaggerList, StaggerItem } from '@/components/StaggerList'
import { HoverCard } from '@/components/HoverCard'

const CATEGORIES = [
  'Clínica', 'Infancia', 'Aprendizaje', 'Fonoaudiología',
  'Psicomotricidad', 'Interdisciplina', 'Familias', 'Salud mental',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
}

type EditForm = {
  title: string; category: string; excerpt: string; content: string
  image_url: string; read_time: string; published: boolean
}

const EMPTY_FORM: EditForm = {
  title: '', category: 'Clínica', excerpt: '', content: '',
  image_url: '', read_time: '5 min', published: true,
}

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
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const openEdit = (a: Article) => {
    setEditingArticle(a)
    setEditForm({
      title: a.title, category: a.category, excerpt: a.excerpt,
      content: a.content, image_url: a.image_url ?? '', read_time: a.read_time,
      published: a.published,
    })
  }

  const closeEdit = () => { setEditingArticle(null); setEditForm(EMPTY_FORM) }

  const handleEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/articulos/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.url) setEditForm(f => ({ ...f, image_url: json.url }))
    setUploadingImg(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = async () => {
    if (!editingArticle) return
    setSaving(true)
    await fetch(`/api/admin/articulos/${editingArticle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setSaving(false)
    closeEdit()
    loadArticles()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este artículo?')) return
    await fetch(`/api/admin/articulos/${id}`, { method: 'DELETE' })
    loadArticles()
  }

  function setField<K extends keyof EditForm>(k: K, v: EditForm[K]) {
    setEditForm(f => ({ ...f, [k]: v }))
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
                  {a.image_url && (
                    <div style={{ width: '100%', height: 180, borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                      <img src={a.image_url} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <span className="writing__tag">{a.category}</span>
                  <h3>
                    <Link href={`/publicaciones/${a.id}`} style={{ color: 'inherit' }}>{a.title}</Link>
                  </h3>
                  <p>{a.excerpt}</p>
                  <span className="writing__meta">
                    <span>{formatDate(a.created_at)}</span>
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

            {/* Imagen */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 8 }}>Imagen de portada</label>
              {editForm.image_url && (
                <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                  <img src={editForm.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => setField('image_url', '')}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Quitar
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleEditImage} style={{ fontSize: 13 }} />
              {uploadingImg && <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>Subiendo imagen…</p>}
            </div>

            {/* Título */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Título *</label>
              <input
                value={editForm.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="Título del artículo"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            {/* Categoría + tiempo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Categoría</label>
                <select
                  value={editForm.category}
                  onChange={e => setField('category', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 15, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Tiempo de lectura</label>
                <input
                  value={editForm.read_time}
                  onChange={e => setField('read_time', e.target.value)}
                  placeholder="5 min"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Bajada */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Descripción corta *</label>
              <textarea
                rows={3}
                value={editForm.excerpt}
                onChange={e => setField('excerpt', e.target.value)}
                placeholder="Resumen breve del artículo"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 15, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {/* Contenido */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}>Contenido</label>
              <textarea
                rows={12}
                value={editForm.content}
                onChange={e => setField('content', e.target.value)}
                placeholder="Texto completo del artículo…"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Publicado */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editForm.published}
                onChange={e => setField('published', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--green-accent)' }}
              />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Publicado</span>
            </label>

            <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
              <button
                onClick={handleSave}
                disabled={saving || uploadingImg}
                style={{ background: 'var(--slate-900)', color: '#fff', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 700, padding: '12px 28px', cursor: 'pointer', opacity: saving ? .6 : 1 }}
              >
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button
                onClick={closeEdit}
                style={{ background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: 'var(--ink-muted)', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
