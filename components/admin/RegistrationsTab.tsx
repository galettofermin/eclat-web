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

// Pestaña "Solicitudes": inscripciones del modal del curso + habilitar/revocar el acceso
export default function RegistrationsTab({ onError, onPendingCount }: {
  onError: (msg: string) => void
  /** Cantidad de solicitudes sin acceso habilitado (para el badge de la pestaña) */
  onPendingCount?: (n: number) => void
}) {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null) // id de la fila en proceso

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/registrations')
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'No se pudieron cargar las solicitudes.')
      const regs: Registration[] = data.registrations ?? []
      setRows(regs)
      onPendingCount?.(regs.filter(r => !r.has_access).length)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'No se pudieron cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }, [onError, onPendingCount])

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

  const handleResetPassword = async (reg: Registration) => {
    if (!confirm(`¿Mandar mail de reset de contraseña a ${reg.email}?`)) return
    setBusy(reg.id)
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: reg.email }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(null)
    if (res.ok) alert(`Mail enviado a ${reg.email}`)
    // El link se generó pero el mail no salió: se muestra para copiarlo y mandarlo por WhatsApp
    else if (data.link) prompt('No se pudo enviar el mail. Copiá este link y mandáselo al alumno (vence en una hora):', data.link)
    else alert(data.error ?? 'Error al enviar el mail')
  }

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--ink-muted)' }}>Cargando solicitudes…</p>
  if (!rows.length) return <p style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-muted)' }}>Todavía no hay solicitudes.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 16 }}>
      {rows.map(reg => {
        const hasAccount = reg.has_account
        const isEnabled = reg.has_access
        const isBusy = busy === reg.id
        return (
          <div key={reg.id} style={{
            background: 'white',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: isBusy ? .55 : 1,
          }}>
            {/* Encabezado: nombre + curso */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>{reg.nombre} {reg.apellido}</p>
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px' }}>{reg.course_title}</p>
              </div>
              {/* Chip de estado */}
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: isEnabled ? '#dcfce7' : '#f1f5f9',
                color: isEnabled ? '#16a34a' : '#64748b',
              }}>
                {isEnabled ? '✓ Habilitado' : 'Pendiente'}
              </span>
            </div>

            {/* Datos en grilla 2 columnas (minmax(0,1fr) + overflowWrap: los mails largos no desbordan) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '6px 16px', fontSize: '13px', color: 'var(--ink-muted)', overflowWrap: 'anywhere' }}>
              <span>📧 <a href={`mailto:${reg.email}`} style={{ color: 'inherit' }}>{reg.email}</a></span>
              <span>📱 {reg.telefono
                ? <a href={`https://wa.me/${reg.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{reg.telefono}</a>
                : '—'}</span>
              <span>📍 {reg.localidad || '—'}</span>
              <span>👤 {reg.rol || '—'}</span>
              <span style={{ gridColumn: '1/-1' }}>📅 {fmtDate(reg.created_at)}</span>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px', alignItems: 'center' }}>
              {!hasAccount ? (
                <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Sin cuenta registrada</span>
              ) : !reg.course_id ? (
                <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>El curso ya no existe</span>
              ) : isEnabled ? (
                <button onClick={() => toggleAccess(reg)} disabled={isBusy} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Revocar acceso
                </button>
              ) : (
                <button onClick={() => toggleAccess(reg)} disabled={isBusy} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--green-700)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Habilitar acceso
                </button>
              )}
              {hasAccount && (
                <button
                  onClick={() => handleResetPassword(reg)}
                  disabled={isBusy}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', color: 'var(--ink-muted)', fontSize: '13px', cursor: 'pointer' }}
                >
                  Resetear contraseña
                </button>
              )}
              <button onClick={() => remove(reg)} disabled={isBusy} aria-label={`Borrar la solicitud de ${reg.nombre} ${reg.apellido}`} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff', color: 'var(--ink-muted)', fontSize: '13px', cursor: 'pointer' }}>
                Borrar
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
