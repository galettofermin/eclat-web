'use client'

import { useCallback, useEffect, useState } from 'react'

type Registration = {
  id: string
  created_at: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  localidad: string
  rol: string | null
  course_id: string | null
  course_title: string
  has_account: boolean
  has_access: boolean
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const th: React.CSSProperties = {
  textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', padding: '10px 14px', borderBottom: '1px solid var(--eclat-border)', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = { fontSize: 13, padding: '12px 14px', borderBottom: '1px solid var(--eclat-border)', verticalAlign: 'top' }
const btn: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
}
const chip = (ok: boolean): React.CSSProperties => ({
  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap',
  color: ok ? 'var(--green-700)' : '#b45309', background: ok ? '#edf3f0' : '#fef3c7',
})

// Pestaña "Solicitudes": inscripciones del modal del curso + habilitar/revocar el acceso
export default function RegistrationsTab({ onError }: { onError: (msg: string) => void }) {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null) // id de la fila en proceso

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/registrations')
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'No se pudieron cargar las solicitudes.')
      setRows(data.registrations ?? [])
    } catch (e) {
      onError(e instanceof Error ? e.message : 'No se pudieron cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => { load() }, [load])

  const run = async (r: Registration, req: Promise<Response>, fallback: string) => {
    setBusy(r.id)
    const res = await req
    if (!res.ok) onError((await res.json().catch(() => ({}))).error ?? fallback)
    await load()
    setBusy(null)
  }

  const toggleAccess = (r: Registration) => {
    if (!r.course_id) return
    if (r.has_access && !confirm(`¿Revocar el acceso de ${r.nombre} ${r.apellido} a "${r.course_title}"?`)) return
    run(r, fetch('/api/admin/grant-access', {
      method: r.has_access ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: r.email, course_id: r.course_id }),
    }), r.has_access ? 'No se pudo revocar el acceso.' : 'No se pudo habilitar el acceso.')
  }

  const remove = (r: Registration) => {
    const note = r.has_access ? '\n\nEl acceso al curso se mantiene; revocalo antes si corresponde.' : ''
    if (!confirm(`¿Borrar la solicitud de ${r.nombre} ${r.apellido}?${note}`)) return
    run(r, fetch('/api/admin/registrations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id }),
    }), 'No se pudo borrar la solicitud.')
  }

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--ink-muted)' }}>Cargando solicitudes…</p>
  if (!rows.length) return <p style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-muted)' }}>Todavía no hay solicitudes.</p>

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1080 }}>
        <thead>
          <tr>
            {['Nombre', 'Mail', 'Teléfono', 'Localidad', 'Rol', 'Curso', 'Fecha', 'Estado', ''].map((h, i) => <th key={i} style={th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const isBusy = busy === r.id
            const canGrant = r.has_account && !!r.course_id
            return (
              <tr key={r.id} style={{ opacity: isBusy ? .55 : 1 }}>
                <td style={{ ...td, fontWeight: 600, color: 'var(--slate-900)' }}>{r.nombre} {r.apellido}</td>
                <td style={td}><a href={`mailto:${r.email}`} style={{ color: 'var(--sage-text)' }}>{r.email}</a></td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <a href={`https://wa.me/${r.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sage-text)' }}>{r.telefono}</a>
                </td>
                <td style={td}>{r.localidad}</td>
                <td style={td}>{r.rol || '—'}</td>
                <td style={td}>{r.course_title}</td>
                <td style={{ ...td, whiteSpace: 'nowrap', color: 'var(--ink-muted)' }}>{fmtDate(r.created_at)}</td>
                <td style={td}><span style={chip(r.has_access)}>{r.has_access ? 'Habilitado' : 'Pendiente'}</span></td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {r.has_access ? (
                      <button onClick={() => toggleAccess(r)} disabled={isBusy} style={{ ...btn, color: '#dc2626', background: '#fef2f2' }}>
                        Revocar acceso
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleAccess(r)}
                        disabled={isBusy || !canGrant}
                        title={!r.has_account ? 'Este mail no tiene una cuenta registrada en el sitio' : !r.course_id ? 'El curso ya no existe' : undefined}
                        style={{ ...btn, color: '#fff', background: canGrant ? '#25655B' : '#b9c2be', cursor: canGrant ? 'pointer' : 'not-allowed' }}
                      >
                        {!r.has_account ? 'Sin cuenta' : 'Habilitar acceso'}
                      </button>
                    )}
                    <button onClick={() => remove(r)} disabled={isBusy} aria-label={`Borrar la solicitud de ${r.nombre} ${r.apellido}`} title="Borrar solicitud"
                      style={{ ...btn, color: 'var(--ink-muted)', background: '#f5f5f7' }}>
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
