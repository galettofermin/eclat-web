'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Enrollment = { enrollmentId: string; courseId: string; title: string; status: string }
type Student = { id: string; email: string; name: string; created_at: string; courses: Enrollment[] }
type Course = { id: string; title: string }

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

const btn: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
}

// Pestaña "Alumnos" del panel: habilitar y revocar cursos a mano.
export default function StudentsTab({ onError }: { onError: (msg: string) => void }) {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [picking, setPicking] = useState<string | null>(null)   // id del alumno con el selector abierto
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/usuarios')
    const data = await res.json()
    if (!res.ok) onError(data.error ?? 'No se pudieron cargar los alumnos.')
    else setStudents(data.users ?? [])
    setLoading(false)
  }, [onError])

  useEffect(() => {
    load()
    createClient().from('courses').select('id, title').order('sort_order')
      .then(({ data }) => setCourses(data ?? []))
  }, [load])

  const enable = async (userId: string) => {
    if (!selected) return
    setBusy(true)
    const res = await fetch('/api/admin/enrollments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId: selected }),
    })
    if (!res.ok) onError((await res.json()).error ?? 'No se pudo habilitar el curso.')
    setPicking(null); setSelected('')
    await load()
    setBusy(false)
  }

  const revoke = async (s: Student, e: Enrollment) => {
    if (!confirm(`¿Revocar el acceso de ${s.name || s.email} a "${e.title}"?`)) return
    setBusy(true)
    const res = await fetch('/api/admin/enrollments', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId: e.enrollmentId }),
    })
    if (!res.ok) onError((await res.json()).error ?? 'No se pudo revocar el acceso.')
    await load()
    setBusy(false)
  }

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--ink-muted)' }}>Cargando alumnos…</p>
  if (!students.length) return <p style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-muted)' }}>Todavía no hay alumnos registrados.</p>

  return (
    <div>
      {students.map((s, i) => {
        const enrolledIds = new Set(s.courses.map(c => c.courseId))
        const available = courses.filter(c => !enrolledIds.has(c.id) || s.courses.some(e => e.courseId === c.id && e.status !== 'approved'))
        return (
          <div key={s.id} style={{ padding: '16px 22px', borderBottom: i < students.length - 1 ? '1px solid var(--eclat-border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate-900)' }}>{s.name || s.email}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  {s.name && <>{s.email} · </>}Registro: {fmtDate(s.created_at)}
                </p>
              </div>
              {picking !== s.id && (
                <button
                  onClick={() => { setPicking(s.id); setSelected('') }}
                  disabled={busy || !available.length}
                  style={{ ...btn, color: '#fff', background: 'var(--slate-900)', opacity: available.length ? 1 : .4 }}
                >
                  Habilitar curso
                </button>
              )}
            </div>

            {picking === s.id && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <select
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                  style={{ flex: 1, minWidth: 200, fontSize: 13, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--eclat-border)' }}
                >
                  <option value="">Elegí un curso…</option>
                  {available.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button onClick={() => enable(s.id)} disabled={busy || !selected} style={{ ...btn, color: '#fff', background: 'var(--green-700)', opacity: selected ? 1 : .5 }}>
                  Habilitar
                </button>
                <button onClick={() => setPicking(null)} style={{ ...btn, color: 'var(--ink-muted)', background: '#f5f5f7' }}>
                  Cancelar
                </button>
              </div>
            )}

            {s.courses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                {s.courses.map(e => (
                  <div key={e.enrollmentId} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f7f8f7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--slate-900)' }}>{e.title}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      color: e.status === 'approved' ? 'var(--green-700)' : '#b45309',
                      background: e.status === 'approved' ? '#edf3f0' : '#fef3c7',
                    }}>
                      {e.status === 'approved' ? 'Habilitado' : e.status === 'pending' ? 'Pendiente' : e.status}
                    </span>
                    <button onClick={() => revoke(s, e)} disabled={busy} style={{ ...btn, fontSize: 12, padding: '4px 10px', color: '#dc2626', background: '#fef2f2' }}>
                      Revocar acceso
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
