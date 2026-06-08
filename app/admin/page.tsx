'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Tab = 'escritos' | 'servicios' | 'textos'

type ArticleRow = {
  id: string
  title: string
  category: string
  created_at: string
  published: boolean
}

type ServicioRow = {
  id: number
  nombre: string
  descripcion: string | null
  imagen_url: string | null
  orden: number
}

type ContentRow = { key: string; value: string }

const CONTENT_GROUPS = [
  { label: 'Home',      keys: ['home.hero.title', 'home.hero.lede', 'home.quote'] },
  { label: 'Conocer',   keys: ['conocer.hero.title', 'conocer.hero.lede'] },
  { label: 'Servicios', keys: ['servicios.hero.title'] },
  { label: 'Formación', keys: ['formacion.hero.title', 'formacion.hero.lede'] },
]

const CONTENT_LABELS: Record<string, string> = {
  'home.hero.title':      'Título del hero',
  'home.hero.lede':       'Bajada del hero',
  'home.quote':           'Frase destacada',
  'conocer.hero.title':   'Título',
  'conocer.hero.lede':    'Bajada',
  'servicios.hero.title': 'Título',
  'formacion.hero.title': 'Título',
  'formacion.hero.lede':  'Bajada',
}

const LONG_KEYS = new Set([
  'home.hero.lede', 'home.quote', 'conocer.hero.lede', 'formacion.hero.lede',
])

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
    <div style={{ width: 22, height: 22, border: '2px solid var(--line)', borderTop: '2px solid var(--sage-deep)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
  </div>
)

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('escritos')

  // Stats
  const [stats, setStats] = useState({ alumnos: 0, formaciones: 0 })

  // Escritos
  const [articles, setArticles]               = useState<ArticleRow[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)

  // Servicios
  const [servicios, setServicios]                 = useState<ServicioRow[]>([])
  const [loadingServicios, setLoadingServicios]   = useState(false)
  const [edits, setEdits]                         = useState<Record<number, { nombre: string; descripcion: string }>>({})
  const [savingServicio, setSavingServicio]       = useState<number | null>(null)
  const [uploadingServicio, setUploadingServicio] = useState<number | null>(null)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // Textos
  const [content, setContent]               = useState<Record<string, string>>({})
  const [loadingContent, setLoadingContent] = useState(false)
  const [savingGroup, setSavingGroup]       = useState<string | null>(null)
  const [savedGroup, setSavedGroup]         = useState<string | null>(null)

  // Error global
  const [error, setError] = useState('')

  // ── Stats ──────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
    ]).then(([{ count: alumnos }, { count: formaciones }]) => {
      setStats({ alumnos: alumnos ?? 0, formaciones: formaciones ?? 0 })
    })
  }, [])

  // ── Escritos ────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'escritos') return
    setLoadingArticles(true)
    fetch('/api/admin/articulos')
      .then(r => r.json())
      .then(data => { setArticles(Array.isArray(data) ? data : []); setLoadingArticles(false) })
      .catch(() => setLoadingArticles(false))
  }, [tab])

  const deleteArticle = async (id: string) => {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    await fetch(`/api/admin/articulos/${id}`, { method: 'DELETE' })
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  // ── Servicios ───────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'servicios') return
    setLoadingServicios(true)
    fetch('/api/servicios')
      .then(r => r.json())
      .then((data: ServicioRow[]) => {
        if (Array.isArray(data)) {
          setServicios(data)
          const map: Record<number, { nombre: string; descripcion: string }> = {}
          data.forEach(s => { map[s.id] = { nombre: s.nombre, descripcion: s.descripcion ?? '' } })
          setEdits(map)
        }
        setLoadingServicios(false)
      })
      .catch(() => setLoadingServicios(false))
  }, [tab])

  const saveServicio = async (id: number) => {
    setSavingServicio(id)
    const { nombre, descripcion } = edits[id] ?? {}
    const res = await fetch(`/api/admin/servicios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion }),
    })
    setSavingServicio(null)
    if (!res.ok) setError('Error al guardar servicio')
  }

  const uploadServicioImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    nombre: string,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingServicio(id)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('nombre', nombre)
    const uploadRes = await fetch('/api/servicios/upload', { method: 'POST', body: fd })
    const uploadData = await uploadRes.json()
    if (!uploadRes.ok) {
      setError(uploadData.error ?? 'Error al subir imagen')
      setUploadingServicio(null)
      return
    }
    await fetch('/api/admin/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, imagen_url: uploadData.url }),
    })
    setServicios(prev => prev.map(s => s.id === id ? { ...s, imagen_url: uploadData.url } : s))
    setUploadingServicio(null)
    if (fileRefs.current[id]) fileRefs.current[id]!.value = ''
  }

  // ── Textos ──────────────────────────────────────────────
  useEffect(() => {
    if (tab !== 'textos') return
    setLoadingContent(true)
    fetch('/api/admin/site-content')
      .then(r => r.json())
      .then((data: ContentRow[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {}
          data.forEach(r => { map[r.key] = r.value })
          setContent(map)
        }
        setLoadingContent(false)
      })
      .catch(() => setLoadingContent(false))
  }, [tab])

  const saveContentGroup = async (groupLabel: string, keys: string[]) => {
    setSavingGroup(groupLabel)
    const items = keys.map(k => ({ key: k, value: content[k] ?? '' }))
    const res = await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    setSavingGroup(null)
    if (res.ok) {
      setSavedGroup(groupLabel)
      setTimeout(() => setSavedGroup(null), 2500)
    } else {
      setError('Error al guardar textos')
    }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

  // ── Shared styles ───────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid var(--eclat-border)',
    overflow: 'hidden',
  }
  const cardHead: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 22px', borderBottom: '1px solid var(--eclat-border)',
  }

  return (
    <div>
      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Alumnos registrados', value: stats.alumnos },
          { label: 'Formaciones activas', value: stats.formaciones },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid var(--eclat-border)' }}>
            <p style={{ fontSize: 30, fontWeight: 300, color: 'var(--eclat-dark)', marginBottom: 2 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--eclat-text-3)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ borderBottom: '1px solid var(--eclat-border)', marginBottom: 24 }}>
        <div style={{ display: 'flex' }}>
          {([
            { key: 'escritos',  label: 'Escritos' },
            { key: 'servicios', label: 'Servicios' },
            { key: 'textos',    label: 'Textos del sitio' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px',
                fontSize: 14, fontWeight: 600,
                background: 'transparent', border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--slate-900)' : '2px solid transparent',
                color: tab === t.key ? 'var(--slate-900)' : 'var(--ink-muted)',
                cursor: 'pointer', transition: 'color .15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ marginBottom: 16, padding: '11px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {error}
          <button onClick={() => setError('')} style={{ fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', marginLeft: 12 }}>✕</button>
        </div>
      )}

      {/* ── Tab: Escritos ── */}
      {tab === 'escritos' && (
        <div style={card}>
          <div style={cardHead}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Escritos</h2>
            <Link
              href="/admin/escritos/nuevo"
              style={{ fontSize: 13, fontWeight: 600, background: 'var(--slate-900)', color: '#fff', padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}
            >
              + Nuevo escrito
            </Link>
          </div>
          {loadingArticles ? <Spinner /> : articles.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: 'var(--ink-muted)', marginBottom: 16 }}>Todavía no hay escritos.</p>
              <Link href="/admin/escritos/nuevo" style={{ fontSize: 14, fontWeight: 600, color: 'var(--sage-deep)' }}>Crear el primero →</Link>
            </div>
          ) : (
            <div>
              {articles.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 22px',
                    borderBottom: i < articles.length - 1 ? '1px solid var(--eclat-border)' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-900)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.title}
                    </p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green-700)', background: '#edf3f0', padding: '2px 7px', borderRadius: 4 }}>
                        {a.category}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{fmtDate(a.created_at)}</span>
                      {!a.published && (
                        <span style={{ fontSize: 11, color: '#b45309', background: '#fef3c7', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>Borrador</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link
                      href={`/admin/escritos/${a.id}`}
                      style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate-900)', background: '#f5f5f7', padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteArticle(a.id)}
                      style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', background: '#fef2f2', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Servicios ── */}
      {tab === 'servicios' && (
        <div style={card}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--eclat-border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Servicios</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>Editá nombre, descripción e imagen.</p>
          </div>
          {loadingServicios ? <Spinner /> : (
            <div>
              {servicios.map((s, i) => {
                const edit = edits[s.id] ?? { nombre: s.nombre, descripcion: s.descripcion ?? '' }
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, alignItems: 'start',
                      padding: '16px 22px',
                      borderBottom: i < servicios.length - 1 ? '1px solid var(--eclat-border)' : 'none',
                    }}
                  >
                    {/* Thumbnail */}
                    {s.imagen_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.imagen_url} alt={s.nombre} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 60, height: 60, background: 'var(--sage-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--sage-deep)', textAlign: 'center', padding: 4 }}>
                        Sin imagen
                      </div>
                    )}

                    {/* Campos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        value={edit.nombre}
                        onChange={e => setEdits(prev => ({ ...prev, [s.id]: { ...edit, nombre: e.target.value } }))}
                        style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 14, fontWeight: 600, outline: 'none', width: '100%' }}
                      />
                      <textarea
                        rows={2}
                        value={edit.descripcion}
                        onChange={e => setEdits(prev => ({ ...prev, [s.id]: { ...edit, descripcion: e.target.value } }))}
                        style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 13, outline: 'none', resize: 'none', width: '100%', lineHeight: 1.5 }}
                      />
                      <input
                        ref={el => { fileRefs.current[s.id] = el }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => uploadServicioImage(e, s.id, edit.nombre)}
                      />
                      <button
                        onClick={() => fileRefs.current[s.id]?.click()}
                        disabled={uploadingServicio === s.id}
                        style={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 600, color: 'var(--sage-deep)', background: 'var(--sage-50)', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}
                      >
                        {uploadingServicio === s.id ? 'Subiendo…' : 'Cambiar imagen'}
                      </button>
                    </div>

                    {/* Guardar */}
                    <button
                      onClick={() => saveServicio(s.id)}
                      disabled={savingServicio === s.id}
                      style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--slate-900)', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', opacity: savingServicio === s.id ? .6 : 1, whiteSpace: 'nowrap' }}
                    >
                      {savingServicio === s.id ? 'Guardando…' : 'Guardar'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Textos del sitio ── */}
      {tab === 'textos' && (
        loadingContent ? <Spinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CONTENT_GROUPS.map(group => (
              <div key={group.label} style={card}>
                <div style={cardHead}>
                  <h2 style={{ fontSize: 15, fontWeight: 600 }}>{group.label}</h2>
                  {savedGroup === group.label && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-700)' }}>✓ Guardado</span>
                  )}
                </div>
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {group.keys.map(key => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
                        {CONTENT_LABELS[key] ?? key}
                      </label>
                      {LONG_KEYS.has(key) ? (
                        <textarea
                          rows={3}
                          value={content[key] ?? ''}
                          onChange={e => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                      ) : (
                        <input
                          value={content[key] ?? ''}
                          onChange={e => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line-strong)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => saveContentGroup(group.label, group.keys)}
                    disabled={savingGroup === group.label}
                    style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--slate-900)', border: 'none', padding: '10px 20px', borderRadius: 999, cursor: 'pointer', opacity: savingGroup === group.label ? .6 : 1, marginTop: 4 }}
                  >
                    {savingGroup === group.label ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
