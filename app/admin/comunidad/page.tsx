'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Alumno {
  id: string
  email: string
  nombre: string
  telefono?: string
  creado: string
  cursos: { titulo: string; estado: string }[]
}

interface Suscriptor {
  id: string
  email: string
  nombre: string
  creado: string
  activo: boolean
}

type Tab = 'alumnos' | 'suscriptores' | 'agregar'
type SelectionMap = Record<string, { email: string; nombre: string }>

// ─── Componente principal ────────────────────────────────────────────────────

export default function ComunidadPage() {
  const [tab, setTab] = useState<Tab>('alumnos')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SelectionMap>({})
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Cargar datos
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const supabase = createClient()

      // Usuarios (alumnos)
      const res = await fetch('/api/admin/usuarios')
      const data = await res.json()
      const users = data.users ?? []

      const enriched: Alumno[] = await Promise.all(users.map(async (u: any) => {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('status, courses(title)')
          .eq('user_id', u.id)

        return {
          id: u.id,
          email: u.email,
          nombre: u.name || '',
          telefono: u.phone || '',
          creado: u.created_at,
          cursos: (enrollments ?? []).map((e: any) => ({
            titulo: e.courses?.title ?? 'Curso desconocido',
            estado: e.status,
          })),
        }
      }))
      setAlumnos(enriched)

      // Suscriptores
      const { data: suscs } = await supabase
        .from('suscriptores')
        .select('id, email, nombre, created_at, activo')
        .order('created_at', { ascending: false })
      setSuscriptores(suscs?.map(s => ({ ...s, creado: s.created_at })) ?? [])

      setLoading(false)
    }
    load()
  }, [])

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const toggleSelect = (id: string, email: string, nombre: string) => {
    setSelected(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = { email, nombre }
      return next
    })
  }

  const selCount = Object.keys(selected).length

  // Filtros
  const filteredAlumnos = alumnos.filter(a =>
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.nombre.toLowerCase().includes(search.toLowerCase())
  )
  const filteredSuscs = suscriptores.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.nombre || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', margin: 0 }}>Comunidad</h1>
        <p style={{ fontSize: 14, color: '#6e6e73', marginTop: 4 }}>
          Alumnos inscriptos y suscriptores al newsletter
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#F5F5F7', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {([
          { id: 'alumnos', label: `Alumnos (${alumnos.length})` },
          { id: 'suscriptores', label: `Suscriptores (${suscriptores.filter(s => s.activo).length})` },
          { id: 'agregar', label: '+ Agregar contacto' },
        ] as { id: Tab; label: string }[]).map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setSelected({}) }}
            style={{
              padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#1d1d1f' : '#6e6e73',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
              transition: 'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Barra de selección flotante ─────────────────────────────── */}
      {selCount > 0 && (
        <div style={{
          position: 'sticky', top: 12, zIndex: 10,
          background: '#1d1d1f', color: '#fff',
          borderRadius: 12, padding: '12px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {selCount} contacto{selCount !== 1 ? 's' : ''} seleccionado{selCount !== 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setSelected({})}
              style={{ fontSize: 13, color: '#a1a1a6', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={() => setShowEmailModal(true)}
              style={{
                fontSize: 13, fontWeight: 600, padding: '7px 16px',
                background: '#4F7566', color: '#fff', border: 'none',
                borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Enviar email
            </button>
          </div>
        </div>
      )}

      {/* ─── Buscador ────────────────────────────────────────────────── */}
      {tab !== 'agregar' && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'alumnos' ? 'Buscar alumno...' : 'Buscar suscriptor...'}
            style={{
              width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
              borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14,
              background: '#fff', color: '#1d1d1f', outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#4F7566')}
            onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.1)')}
          />
        </div>
      )}

      {/* ─── Tab: Alumnos ────────────────────────────────────────────── */}
      {tab === 'alumnos' && (
        loading ? <Spinner /> : filteredAlumnos.length === 0 ? (
          <Empty text={search ? 'Sin resultados.' : 'Todavía no hay alumnos registrados.'} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredAlumnos.map(a => {
              const isSelected = !!selected[a.id]
              return (
                <div key={a.id} style={{
                  background: '#fff', borderRadius: 14, border: `1.5px solid ${isSelected ? '#4F7566' : 'rgba(0,0,0,0.06)'}`,
                  overflow: 'hidden', transition: 'border-color 0.15s',
                }}>
                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Checkbox */}
                    <div onClick={() => toggleSelect(a.id, a.email, a.nombre)}
                      style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                        border: `2px solid ${isSelected ? '#4F7566' : '#d1d1d6'}`,
                        background: isSelected ? '#4F7566' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                      {isSelected && (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#DCEFE8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontWeight: 700, fontSize: 15, color: '#2F7D6B',
                    }}>
                      {(a.nombre || a.email).charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>
                        {a.nombre || <span style={{ color: '#86868b', fontWeight: 400, fontStyle: 'italic' }}>Sin nombre</span>}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6e6e73' }}>{a.email}</p>
                    </div>

                    {/* Meta */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 11, color: '#a1a1a6' }}>Desde {fmt(a.creado)}</p>
                      {a.cursos.length > 0 && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {a.cursos.map((c, i) => (
                            <span key={i} style={{
                              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                              background: c.estado === 'approved' ? '#DCEFE8' : '#fff3cd',
                              color: c.estado === 'approved' ? '#2F7D6B' : '#856404',
                            }}>
                              {c.titulo.length > 20 ? c.titulo.slice(0, 18) + '…' : c.titulo}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* ─── Tab: Suscriptores ───────────────────────────────────────── */}
      {tab === 'suscriptores' && (
        loading ? <Spinner /> : filteredSuscs.length === 0 ? (
          <Empty text={search ? 'Sin resultados.' : 'No hay suscriptores todavía.'} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredSuscs.map(s => {
              const isSelected = !!selected[s.id]
              return (
                <div key={s.id} style={{
                  background: '#fff', borderRadius: 14,
                  border: `1.5px solid ${isSelected ? '#4F7566' : 'rgba(0,0,0,0.06)'}`,
                  padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'border-color 0.15s',
                }}>
                  {/* Checkbox */}
                  <div onClick={() => s.activo && toggleSelect(s.id, s.email, s.nombre)}
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      cursor: s.activo ? 'pointer' : 'not-allowed',
                      border: `2px solid ${isSelected ? '#4F7566' : '#d1d1d6'}`,
                      background: isSelected ? '#4F7566' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', opacity: s.activo ? 1 : 0.4,
                    }}>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: s.activo ? '#e8f0fe' : '#f5f5f7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontWeight: 700, fontSize: 15,
                    color: s.activo ? '#3b5bdb' : '#a1a1a6',
                  }}>
                    {(s.nombre || s.email).charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>
                      {s.nombre || <span style={{ color: '#86868b', fontWeight: 400, fontStyle: 'italic' }}>Sin nombre</span>}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6e6e73' }}>{s.email}</p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                      background: s.activo ? '#DCEFE8' : '#f5f5f7',
                      color: s.activo ? '#2F7D6B' : '#86868b',
                    }}>
                      {s.activo ? 'Activo' : 'Dado de baja'}
                    </span>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#a1a1a6' }}>Desde {fmt(s.creado)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* ─── Tab: Agregar contacto ───────────────────────────────────── */}
      {tab === 'agregar' && <AgregarContacto />}

      {/* ─── Modal de email ──────────────────────────────────────────── */}
      {showEmailModal && (
        <EmailModal
          destinatarios={Object.values(selected)}
          onClose={() => setShowEmailModal(false)}
          onSent={() => { setShowEmailModal(false); setSelected({}) }}
        />
      )}
    </div>
  )
}

// ─── Agregar contacto ────────────────────────────────────────────────────────

function AgregarContacto() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', nota: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setResult(null)

    // Suscribir al newsletter
    const res = await fetch('/api/newsletter/suscribir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email.trim(), nombre: form.nombre.trim() }),
    })

    if (res.ok) {
      setResult({ ok: true, msg: `${form.nombre || form.email} fue agregado/a a la comunidad y al newsletter.` })
      setForm({ nombre: '', email: '', telefono: '', nota: '' })
    } else {
      const d = await res.json().catch(() => ({}))
      setResult({ ok: false, msg: d.error || 'Ocurrió un error al agregar el contacto.' })
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#1d1d1f',
    outline: 'none', boxSizing: 'border-box',
  }
  const focus = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#4F7566'),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'rgba(0,0,0,0.12)'),
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', padding: '28px 28px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600, color: '#1d1d1f' }}>Nuevo contacto</h2>
        <p style={{ margin: '0 0 24px', fontSize: 13.5, color: '#6e6e73', lineHeight: 1.5 }}>
          La persona quedará suscripta al newsletter y podrás enviarle emails desde el panel.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Nombre
              </label>
              <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                placeholder="Ej: María" style={inputStyle} {...focus} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Apellido / Alias
              </label>
              <input value={form.nota} onChange={e => set('nota', e.target.value)}
                placeholder="Ej: García" style={inputStyle} {...focus} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Email <span style={{ color: '#ff3b30' }}>*</span>
            </label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="contacto@email.com" style={inputStyle} {...focus} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Teléfono <span style={{ color: '#a1a1a6', fontWeight: 400, textTransform: 'none', fontSize: 11 }}>(opcional)</span>
            </label>
            <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
              placeholder="+54 9 3572..." style={inputStyle} {...focus} />
          </div>

          {result && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, fontSize: 13.5,
              background: result.ok ? '#f0faf4' : '#fff5f5',
              border: `1px solid ${result.ok ? '#b7e4c7' : '#fed7d7'}`,
              color: result.ok ? '#2F7D6B' : '#c53030',
            }}>
              {result.msg}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: loading ? '#a1a1a6' : '#2F7D6B', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}>
            {loading ? 'Agregando...' : 'Agregar a la comunidad'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 16, fontSize: 12.5, color: '#a1a1a6', lineHeight: 1.6, textAlign: 'center' }}>
        El contacto quedará en la lista de suscriptores. Desde ahí podés seleccionarlo y enviarle emails.
      </p>
    </div>
  )
}

// ─── Modal de email ──────────────────────────────────────────────────────────

function EmailModal({
  destinatarios,
  onClose,
  onSent,
}: {
  destinatarios: { email: string; nombre: string }[]
  onClose: () => void
  onSent: () => void
}) {
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const handleSend = async () => {
    if (!asunto.trim() || !mensaje.trim()) return
    setLoading(true); setResult(null)

    const res = await fetch('/api/admin/comunidad/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinatarios, asunto, mensaje }),
    })
    const data = await res.json()

    if (res.ok && data.ok) {
      setResult({ ok: true, msg: `✓ Email enviado a ${data.enviados} contacto${data.enviados !== 1 ? 's' : ''}${data.errores > 0 ? ` (${data.errores} con error)` : ''}.` })
      setTimeout(onSent, 2000)
    } else {
      setResult({ ok: false, msg: data.error || 'Error al enviar.' })
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)', zIndex: 100,
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff', borderRadius: 18, width: '90%', maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', zIndex: 101,
        overflow: 'hidden',
      }}>
        {/* Header modal */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>Enviar email</h3>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6e6e73' }}>
              Para: {destinatarios.length === 1
                ? `${destinatarios[0].nombre || destinatarios[0].email}`
                : `${destinatarios.length} contactos`}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6e6e73',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Cuerpo modal */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Destinatarios chips */}
          {destinatarios.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {destinatarios.slice(0, 5).map((d, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 20,
                  background: '#EDF3F0', color: '#4F7566', fontWeight: 500,
                }}>
                  {d.nombre || d.email}
                </span>
              ))}
              {destinatarios.length > 5 && (
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#f5f5f7', color: '#6e6e73' }}>
                  +{destinatarios.length - 5} más
                </span>
              )}
            </div>
          )}

          {/* Asunto */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Asunto
            </label>
            <input value={asunto} onChange={e => setAsunto(e.target.value)}
              placeholder="Ej: Novedades de ÉCLAT" disabled={loading}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#1d1d1f',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#4F7566')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
            />
          </div>

          {/* Mensaje */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Mensaje
            </label>
            <textarea
              value={mensaje} onChange={e => setMensaje(e.target.value)}
              placeholder={"Escribí el mensaje acá.\n\nPodés usar párrafos separados con una línea en blanco.\n\nEl email llegará con el diseño oficial de ÉCLAT."}
              rows={9} disabled={loading}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
                border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#1d1d1f',
                outline: 'none', resize: 'vertical', lineHeight: 1.6,
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#4F7566')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.12)')}
            />
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#a1a1a6' }}>
              El email llega con el diseño oficial de ÉCLAT. Dejá líneas en blanco entre párrafos.
            </p>
          </div>

          {result && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, fontSize: 13.5,
              background: result.ok ? '#f0faf4' : '#fff5f5',
              border: `1px solid ${result.ok ? '#b7e4c7' : '#fed7d7'}`,
              color: result.ok ? '#2F7D6B' : '#c53030',
            }}>
              {result.msg}
            </div>
          )}
        </div>

        {/* Footer modal */}
        <div style={{ padding: '0 24px 20px', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading} style={{
            padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff', color: '#6e6e73', fontSize: 14, cursor: 'pointer',
          }}>
            Cancelar
          </button>
          <button onClick={handleSend} disabled={loading || !asunto.trim() || !mensaje.trim()} style={{
            padding: '10px 22px', borderRadius: 10, border: 'none',
            background: loading || !asunto.trim() || !mensaje.trim() ? '#a1a1a6' : '#2F7D6B',
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: loading || !asunto.trim() || !mensaje.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s',
          }}>
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Enviando...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Enviar{destinatarios.length > 1 ? ` (${destinatarios.length})` : ''}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e8e8ed', borderTopColor: '#2F7D6B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', padding: '48px 24px', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 15, color: '#86868b' }}>{text}</p>
    </div>
  )
}
