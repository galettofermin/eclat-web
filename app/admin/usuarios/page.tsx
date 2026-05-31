'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CourseProgress {
  course_id: string
  course_title: string
  status: string
  total_modules: number
  completed_modules: number
  quizzes_done: number
  avg_score: number | null
}

interface UserRow {
  id: string
  email: string
  name: string
  created_at: string
  courses: CourseProgress[]
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const res = await window.fetch('/api/admin/usuarios')
      const data = await res.json()
      // For each user, enrich with progress
      const enriched = await Promise.all((data.users ?? []).map(async (u: UserRow) => {
        const supabase = createClient()

        // Get enrollments
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id, status, courses(id, title)')
          .eq('user_id', u.id)

        const courses: CourseProgress[] = await Promise.all(
          (enrollments ?? []).map(async (enr: any) => {
            const [{ count: total }, { count: done }, { data: quizRes }] = await Promise.all([
              supabase.from('course_modules').select('*', { count: 'exact', head: true }).eq('course_id', enr.course_id),
              supabase.from('module_progress').select('*', { count: 'exact', head: true })
                .eq('course_id', enr.course_id).eq('user_id', u.id),
              supabase.from('quiz_results').select('score, total')
                .eq('course_id', enr.course_id).eq('user_id', u.id),
            ])

            const avgScore = quizRes?.length
              ? Math.round(quizRes.reduce((acc: number, r: any) => acc + (r.score / r.total) * 100, 0) / quizRes.length)
              : null

            return {
              course_id: enr.course_id,
              course_title: enr.courses?.title ?? 'Curso desconocido',
              status: enr.status,
              total_modules: total ?? 0,
              completed_modules: done ?? 0,
              quizzes_done: quizRes?.length ?? 0,
              avg_score: avgScore,
            }
          })
        )

        return { ...u, courses }
      }))

      setUsers(enriched)
      setLoading(false)
    }
    fetch()
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar la cuenta de ${email}?`)) return
    await fetch('/api/admin/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Usuarios</h1>
          <p className="text-[15px] text-[#6E6E73]">{users.length} cuenta{users.length !== 1 ? 's' : ''} registrada{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative my-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5" className="absolute left-4 top-1/2 -translate-y-1/2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"/>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
          <p className="text-[16px] text-[#6E6E73]">{search ? 'No se encontraron usuarios.' : 'Todavía no hay usuarios registrados.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <div key={u.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              {/* Usuario row */}
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-[#F9F9F9] transition-colors"
                onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
                <div className="w-10 h-10 rounded-full bg-[#DCEFE8] flex items-center justify-center shrink-0 text-[#2F7D6B] font-bold text-[15px]">
                  {(u.name || u.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#0A0A0A] truncate">
                    {u.name || <span className="text-[#6E6E73] font-normal italic">Sin nombre</span>}
                  </p>
                  <p className="text-[13px] text-[#6E6E73] truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-[#86868b]">Registrado {formatDate(u.created_at)}</p>
                    <p className="text-[11px] text-[#86868b]">
                      {u.courses.length} curso{u.courses.length !== 1 ? 's' : ''}
                      {u.courses.filter(c => c.status === 'approved').length > 0 && (
                        <span className="text-[#2F7D6B] ml-1">({u.courses.filter(c => c.status === 'approved').length} activo{u.courses.filter(c => c.status === 'approved').length !== 1 ? 's' : ''})</span>
                      )}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2"
                    className={`transition-transform ${expanded === u.id ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Detalle expandido */}
              {expanded === u.id && (
                <div className="border-t border-black/5 px-5 py-4 bg-[#FAFAFA] space-y-4">
                  {u.courses.length === 0 ? (
                    <p className="text-[13px] text-[#86868b]">No tiene cursos adquiridos.</p>
                  ) : (
                    u.courses.map(c => (
                      <div key={c.course_id} className="bg-white rounded-xl border border-black/[0.06] p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <p className="text-[14px] font-semibold text-[#0A0A0A]">{c.course_title}</p>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                            c.status === 'approved' ? 'bg-[#DCEFE8] text-[#2F7D6B]'
                            : c.status === 'pending' ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-500'
                          }`}>
                            {c.status === 'approved' ? 'Activo' : c.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </div>

                        {c.status === 'approved' && c.total_modules > 0 && (
                          <div className="space-y-2">
                            {/* Barra progreso */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-[12px] text-[#6E6E73]">
                                  Módulos: {c.completed_modules}/{c.total_modules}
                                </span>
                                <span className="text-[12px] font-bold text-[#2F7D6B]">
                                  {c.total_modules ? Math.round((c.completed_modules / c.total_modules) * 100) : 0}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                                <div className="h-full bg-[#2F7D6B] rounded-full"
                                  style={{ width: `${c.total_modules ? Math.round((c.completed_modules / c.total_modules) * 100) : 0}%` }}/>
                              </div>
                            </div>

                            {/* Quizzes */}
                            <div className="flex items-center gap-4 text-[12px] text-[#6E6E73]">
                              <span>Cierres completados: <span className="font-semibold text-[#0A0A0A]">{c.quizzes_done}</span></span>
                              {c.avg_score !== null && (
                                <span>Promedio: <span className={`font-semibold ${c.avg_score >= 60 ? 'text-[#2F7D6B]' : 'text-amber-600'}`}>{c.avg_score}%</span></span>
                              )}
                            </div>
                          </div>
                        )}

                        {c.status === 'approved' && c.total_modules === 0 && (
                          <p className="text-[12px] text-[#86868b]">Sin módulos cargados todavía.</p>
                        )}
                      </div>
                    ))
                  )}

                  {/* Eliminar usuario */}
                  <div className="pt-2 border-t border-black/5">
                    <button onClick={() => deleteUser(u.id, u.email)}
                      className="text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                      </svg>
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
