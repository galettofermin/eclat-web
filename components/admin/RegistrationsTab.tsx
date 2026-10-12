'use client'

import { useEffect, useState } from 'react'

type Registration = {
  id: string
  created_at: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  localidad: string
  rol: string | null
  course_title: string
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const th: React.CSSProperties = {
  textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', padding: '10px 14px', borderBottom: '1px solid var(--eclat-border)', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = { fontSize: 13, padding: '12px 14px', borderBottom: '1px solid var(--eclat-border)', verticalAlign: 'top' }

// Pestaña "Inscripciones": lo que llega desde el modal de la página del curso
export default function RegistrationsTab({ onError }: { onError: (msg: string) => void }) {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/registrations')
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? 'No se pudieron cargar las inscripciones.')
        setRows(data.registrations ?? [])
      })
      .catch(e => onError(e.message))
      .finally(() => setLoading(false))
  }, [onError])

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--ink-muted)' }}>Cargando inscripciones…</p>
  if (!rows.length) return <p style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-muted)' }}>Todavía no hay inscripciones.</p>

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
        <thead>
          <tr>
            {['Fecha', 'Nombre', 'Mail', 'Teléfono', 'Localidad', 'Rol', 'Curso'].map(h => <th key={h} style={th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td style={{ ...td, whiteSpace: 'nowrap', color: 'var(--ink-muted)' }}>{fmtDate(r.created_at)}</td>
              <td style={{ ...td, fontWeight: 600, color: 'var(--slate-900)' }}>{r.nombre} {r.apellido}</td>
              <td style={td}><a href={`mailto:${r.email}`} style={{ color: 'var(--sage-text)' }}>{r.email}</a></td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>
                <a href={`https://wa.me/${r.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sage-text)' }}>{r.telefono}</a>
              </td>
              <td style={td}>{r.localidad}</td>
              <td style={td}>{r.rol || '—'}</td>
              <td style={td}>{r.course_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
