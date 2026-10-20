'use client'

import { useEffect, useState, useRef } from 'react'

/* ── Tipos ── */
type BloqueType = 'articulo' | 'formacion' | 'institucional'

interface Bloque {
  id: string
  tipo: BloqueType
  // articulo
  articuloId?: string
  // formacion
  cursoId?: string
  // institucional
  texto?: string
  imagenUrl?: string  // URL pública ya subida
  imagenFile?: File   // archivo local pendiente de subir
  imagenPreview?: string
}

interface Articulo { id: string; title: string; excerpt: string; category: string }
interface Curso { id: string; title: string; badge: string }
interface Suscriptor { id: string; email: string; nombre: string | null; lista: string }
interface Envio {
  id: string
  asunto: string
  total_enviados: number
  total_errores: number
  creado_en: string
  bloques?: unknown
}

/* ── Helpers ── */
const uid = () => Math.random().toString(36).slice(2, 9)

const BLOQUE_LABELS: Record<BloqueType, string> = {
  articulo: '📝 Artículo',
  formacion: '🎓 Formación',
  institucional: '📣 Mensaje institucional',
}

/* ══════════════════════════════════════════════════════ */
export default function AdminNewsletter() {
  /* ── Datos ── */
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>([])
  const [historial, setHistorial] = useState<Envio[]>([])
  const [loading, setLoading] = useState(true)

  /* ── Compositor ── */
  const [asunto, setAsunto] = useState('')
  const [bloques, setBloques] = useState<Bloque[]>([{ id: uid(), tipo: 'articulo' }])

  /* ── Destinatarios ── */
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [filtroLista, setFiltroLista] = useState<'todos' | 'pausa' | 'general'>('todos')

  /* ── Estado envío ── */
  const [enviando, setEnviando] = useState(false)
  const [enviandoPrueba, setEnviandoPrueba] = useState(false)
  const [resultado, setResultado] = useState<{ ok: boolean; msg: string } | null>(null)

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  /* ── Carga inicial ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [resArts, resCursos, resSusc, resHist] = await Promise.all([
        fetch('/api/admin/articulos?publicados=true'),
        fetch('/api/admin/cursos?publicados=true'),
        fetch('/api/admin/suscriptores'),
        fetch('/api/admin/newsletter/historial'),
      ])
      const [arts, curs, susc, hist] = await Promise.all([
        resArts.ok ? resArts.json() : [],
        resCursos.ok ? resCursos.json() : [],
        resSusc.ok ? resSusc.json() : [],
        resHist.ok ? resHist.json() : [],
      ])
      setArticulos(Array.isArray(arts) ? arts : [])
      setCursos(Array.isArray(curs) ? curs : [])
      const lista = Array.isArray(susc) ? susc : []
      setSuscriptores(lista)
      setSeleccionados(new Set<string>(lista.map((s: Suscriptor) => s.id)))
      setHistorial(Array.isArray(hist) ? hist : [])
      setLoading(false)
    }
    load()
  }, [])

  /* ── Filtro suscriptores ── */
  const suscriptoresFiltrados = suscriptores.filter(s =>
    filtroLista === 'todos' ? true : s.lista === filtroLista
  )

  const toggleSuscriptor = (id: string) => {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleTodos = () => {
    const ids = suscriptoresFiltrados.map(s => s.id)
    const todosSeleccionados = ids.every(id => seleccionados.has(id))
    setSeleccionados(prev => {
      const next = new Set(prev)
      if (todosSeleccionados) {
        ids.forEach(id => next.delete(id))
      } else {
        ids.forEach(id => next.add(id))
      }
      return next
    })
  }

  /* ── Bloques ── */
  const agregarBloque = (tipo: BloqueType) => {
    if (bloques.length >= 3) return
    setBloques(prev => [...prev, { id: uid(), tipo }])
  }

  const eliminarBloque = (id: string) => {
    setBloques(prev => prev.filter(b => b.id !== id))
  }

  const actualizarBloque = (id: string, cambios: Partial<Bloque>) => {
    setBloques(prev => prev.map(b => b.id === id ? { ...b, ...cambios } : b))
  }

  const handleImagenChange = (bloqueId: string, file: File | undefined) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    actualizarBloque(bloqueId, { imagenFile: file, imagenPreview: preview, imagenUrl: undefined })
  }

  /* ── Subir imagen a Supabase storage ── */
  const subirImagen = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/newsletter/upload-imagen', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok || !data.url) throw new Error(data.error || 'Error al subir imagen')
    return data.url
  }

  /* ── Preparar payload ── */
  const prepararBloques = async () => {
    const resultado = []
    for (const b of bloques) {
      if (b.tipo === 'articulo') {
        if (!b.articuloId) throw new Error('Elegí un artículo en todos los bloques')
        resultado.push({ tipo: 'articulo', articuloId: b.articuloId })
      } else if (b.tipo === 'formacion') {
        if (!b.cursoId) throw new Error('Elegí una formación en todos los bloques')
        resultado.push({ tipo: 'formacion', cursoId: b.cursoId })
      } else if (b.tipo === 'institucional') {
        if (!b.texto?.trim()) throw new Error('El mensaje institucional no puede estar vacío')
        let imagenUrl = b.imagenUrl
        if (b.imagenFile) {
          imagenUrl = await subirImagen(b.imagenFile)
        }
        resultado.push({ tipo: 'institucional', texto: b.texto, imagenUrl })
      }
    }
    return resultado
  }

  /* ── Envío real ── */
  const enviar = async () => {
    if (!asunto.trim()) { setResultado({ ok: false, msg: 'El asunto es obligatorio' }); return }
    if (bloques.length === 0) { setResultado({ ok: false, msg: 'Agregá al menos un bloque' }); return }
    const ids = Array.from(seleccionados)
    if (ids.length === 0) { setResultado({ ok: false, msg: 'Seleccioná al menos un suscriptor' }); return }

    setEnviando(true)
    setResultado(null)
    try {
      const bloquesPreparados = await prepararBloques()
      const res = await fetch('/api/newsletter/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asunto, bloques: bloquesPreparados, suscriptorIds: ids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar')
      setResultado({ ok: true, msg: `✓ Enviado a ${data.enviados} suscriptor${data.enviados !== 1 ? 'es' : ''}${data.errores ? ` (${data.errores} con error)` : ''}` })
      // Recargar historial
      const resHist = await fetch('/api/admin/newsletter/historial')
      const hist = await resHist.json()
      setHistorial(Array.isArray(hist) ? hist : [])
    } catch (err: unknown) {
      setResultado({ ok: false, msg: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setEnviando(false)
    }
  }

  /* ── Envío de prueba ── */
  const enviarPrueba = async () => {
    if (!asunto.trim()) { setResultado({ ok: false, msg: 'El asunto es obligatorio' }); return }
    if (bloques.length === 0) { setResultado({ ok: false, msg: 'Agregá al menos un bloque' }); return }
    setEnviandoPrueba(true)
    setResultado(null)
    try {
      const bloquesPreparados = await prepararBloques()
      const res = await fetch('/api/newsletter/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asunto, bloques: bloquesPreparados, prueba: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setResultado({ ok: true, msg: '✓ Prueba enviada a tu mail' })
    } catch (err: unknown) {
      setResultado({ ok: false, msg: err instanceof Error ? err.message : 'Error' })
    } finally {
      setEnviandoPrueba(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <div style={{ width: 28, height: 28, border: '2px solid #2F7D6B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  const todosChecked = suscriptoresFiltrados.length > 0 && suscriptoresFiltrados.every(s => seleccionados.has(s.id))
  const totalSeleccionados = Array.from(seleccionados).filter(id => suscriptores.some(s => s.id === id)).length

  return (
    <div style={{ maxWidth: 900 }}>
      {/* ── Encabezado ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2B26', margin: 0, letterSpacing: '-0.02em' }}>
          Newsletter
        </h1>
        <p style={{ fontSize: 14, color: '#6E6E73', marginTop: 4 }}>
          Armá el envío combinando bloques y elegí los destinatarios
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* ── Columna izquierda: compositor ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Asunto */}
          <div style={card}>
            <label style={labelStyle}>Asunto del mail</label>
            <input
              type="text"
              placeholder="Ej: Nueva formación disponible — ÉCLAT"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Bloques */}
          {bloques.map((bloque, idx) => (
            <div key={bloque.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4F7566', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Bloque {idx + 1} · {BLOQUE_LABELS[bloque.tipo]}
                </span>
                <button onClick={() => eliminarBloque(bloque.id)} style={btnIconStyle} title="Eliminar bloque">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Tipo: artículo */}
              {bloque.tipo === 'articulo' && (
                <div>
                  <label style={labelStyle}>Seleccioná un artículo publicado</label>
                  <select
                    value={bloque.articuloId ?? ''}
                    onChange={e => actualizarBloque(bloque.id, { articuloId: e.target.value })}
                    style={selectStyle}
                  >
                    <option value="">— Elegí un artículo —</option>
                    {articulos.map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                  {bloque.articuloId && (
                    <p style={{ fontSize: 12, color: '#7A9088', marginTop: 6 }}>
                      {articulos.find(a => a.id === bloque.articuloId)?.excerpt}
                    </p>
                  )}
                </div>
              )}

              {/* Tipo: formación */}
              {bloque.tipo === 'formacion' && (
                <div>
                  <label style={labelStyle}>Seleccioná una formación</label>
                  <select
                    value={bloque.cursoId ?? ''}
                    onChange={e => actualizarBloque(bloque.id, { cursoId: e.target.value })}
                    style={selectStyle}
                  >
                    <option value="">— Elegí una formación —</option>
                    {cursos.map(c => (
                      <option key={c.id} value={c.id}>{c.badge} · {c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tipo: institucional */}
              {bloque.tipo === 'institucional' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Mensaje</label>
                    <textarea
                      placeholder="Escribí el mensaje institucional..."
                      value={bloque.texto ?? ''}
                      onChange={e => actualizarBloque(bloque.id, { texto: e.target.value })}
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Imagen (opcional)</label>
                    {bloque.imagenPreview && (
                      <div style={{ marginBottom: 8 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bloque.imagenPreview} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 160, objectFit: 'cover' }} />
                      </div>
                    )}
                    <input
                      ref={el => { fileRefs.current[bloque.id] = el }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleImagenChange(bloque.id, e.target.files?.[0])}
                    />
                    <button
                      onClick={() => fileRefs.current[bloque.id]?.click()}
                      style={btnSecundario}
                    >
                      {bloque.imagenPreview ? '↺ Cambiar imagen' : '+ Subir imagen'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Agregar bloque */}
          {bloques.length < 3 && (
            <div style={{ ...card, padding: '14px 20px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA8A3', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'block' }}>
                Agregar bloque ({bloques.length}/3)
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['articulo', 'formacion', 'institucional'] as BloqueType[]).map(tipo => (
                  <button key={tipo} onClick={() => agregarBloque(tipo)} style={btnSecundario}>
                    {BLOQUE_LABELS[tipo]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botones envío */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={enviarPrueba}
              disabled={enviandoPrueba || enviando}
              style={{ ...btnSecundario, padding: '10px 18px', fontSize: 13 }}
            >
              {enviandoPrueba ? 'Enviando...' : '📧 Enviar prueba a mi mail'}
            </button>
            <button
              onClick={enviar}
              disabled={enviando || enviandoPrueba || totalSeleccionados === 0}
              style={{
                backgroundColor: enviando ? '#9CA8A3' : '#1B2B26',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 13,
                fontWeight: 700,
                cursor: enviando || totalSeleccionados === 0 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              {enviando ? 'Enviando...' : `Enviar a ${totalSeleccionados} suscriptor${totalSeleccionados !== 1 ? 'es' : ''} →`}
            </button>
          </div>

          {resultado && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: resultado.ok ? '#e8f5f0' : '#fef2f2',
              color: resultado.ok ? '#1E5C4A' : '#dc2626',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {resultado.msg}
            </div>
          )}

          {/* ── Historial ── */}
          {historial.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1B2B26', marginBottom: 12, letterSpacing: '-0.01em' }}>
                Historial de envíos
              </h2>
              <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E8EDE9', background: '#F9FAF9' }}>
                      <th style={thStyle}>Asunto</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>Enviados</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((e, i) => (
                      <tr key={e.id} style={{ borderBottom: i < historial.length - 1 ? '1px solid #F0F4F2' : 'none' }}>
                        <td style={{ ...tdStyle, color: '#1B2B26', fontWeight: 500 }}>{e.asunto}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={{ color: '#2F7D6B', fontWeight: 700 }}>{e.total_enviados}</span>
                          {e.total_errores > 0 && <span style={{ color: '#dc2626', marginLeft: 4 }}>({e.total_errores} err)</span>}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right', color: '#9CA8A3' }}>
                          {new Date(e.creado_en).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Columna derecha: destinatarios ── */}
        <div style={{ ...card, padding: 0, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F0F4F2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2B26' }}>
                Destinatarios
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2F7D6B', background: '#e8f5f0', padding: '3px 8px', borderRadius: 20 }}>
                {totalSeleccionados} seleccionados
              </span>
            </div>
            {/* Filtro lista */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['todos', 'general', 'pausa'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltroLista(f)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 20,
                    border: filtroLista === f ? 'none' : '1px solid #E2EBE6',
                    background: filtroLista === f ? '#2F7D6B' : 'transparent',
                    color: filtroLista === f ? '#fff' : '#6E6E73',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Seleccionar todos */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F0F4F2', cursor: 'pointer' }}
            onClick={toggleTodos}
          >
            <div style={{
              width: 16, height: 16, borderRadius: 4, border: '1.5px solid', flexShrink: 0,
              borderColor: todosChecked ? '#2F7D6B' : '#C4CFC9',
              background: todosChecked ? '#2F7D6B' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {todosChecked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#424245' }}>
              Seleccionar todos ({suscriptoresFiltrados.length})
            </span>
          </div>

          {/* Lista de suscriptores */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {suscriptoresFiltrados.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9CA8A3', fontSize: 13, padding: '24px 16px' }}>
                Sin suscriptores en esta lista
              </p>
            ) : (
              suscriptoresFiltrados.map(s => {
                const checked = seleccionados.has(s.id)
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #F8FAF9',
                      background: checked ? 'rgba(47,125,107,0.04)' : 'transparent',
                    }}
                    onClick={() => toggleSuscriptor(s.id)}
                  >
                    <div style={{
                      width: 15, height: 15, borderRadius: 4, border: '1.5px solid', flexShrink: 0,
                      borderColor: checked ? '#2F7D6B' : '#C4CFC9',
                      background: checked ? '#2F7D6B' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      {s.nombre && (
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1B2B26', lineHeight: 1.2 }}>{s.nombre}</div>
                      )}
                      <div style={{ fontSize: 11, color: '#7A9088', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.email}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Estilos ── */
const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E8EDE9',
  borderRadius: 12,
  padding: '20px 22px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6E6E73',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #D4DDD9',
  borderRadius: 8,
  fontSize: 14,
  color: '#1B2B26',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#FAFBFA',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

const btnSecundario: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: '#2F7D6B',
  background: 'transparent',
  border: '1.5px solid #2F7D6B',
  borderRadius: 8,
  padding: '7px 14px',
  cursor: 'pointer',
  letterSpacing: '0.02em',
}

const btnIconStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#9CA8A3',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
}

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#7A9088',
  textAlign: 'left',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 16px',
  fontSize: 13,
  color: '#6E6E73',
}
