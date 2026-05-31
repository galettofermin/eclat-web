'use client'

import { useEffect, useState } from 'react'

interface UserRow {
  id: string
  email: string
  name: string
  created_at: string
  courses: { title: string; status: string }[]
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/usuarios')
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const deleteUser = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar la cuenta de ${email}? Perderá acceso a todos los cursos.`)) return
    await fetch('/api/admin/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id }),
    })
    fetchUsers()
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Usuarios</h1>
          <p className="text-[15px] text-[#6E6E73]">
            {users.length} cuenta{users.length !== 1 ? 's' : ''} registrada{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative mb-6 mt-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5" className="absolute left-4 top-1/2 -translate-y-1/2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
          <p className="text-[16px] text-[#6E6E73]">
            {search ? 'No se encontraron usuarios.' : 'Todavía no hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-black/5 px-5 py-4 flex items-start gap-4">
              {/* Avatar inicial */}
              <div className="w-10 h-10 rounded-full bg-[#DCEFE8] flex items-center justify-center shrink-0 text-[#2F7D6B] font-bold text-[15px] mt-0.5">
                {(u.name || u.email).charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#0A0A0A] truncate">
                  {u.name || <span className="text-[#6E6E73] font-normal italic">Sin nombre</span>}
                </p>
                <p className="text-[13px] text-[#6E6E73] truncate">{u.email}</p>
                <p className="text-[12px] text-[#86868b] mt-0.5">Registrado el {formatDate(u.created_at)}</p>

                {/* Cursos */}
                {u.courses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {u.courses.map((c, i) => (
                      <span
                        key={i}
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          c.status === 'approved'
                            ? 'bg-[#DCEFE8] text-[#2F7D6B]'
                            : c.status === 'pending'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-[#F5F5F7] text-[#6E6E73]'
                        }`}
                      >
                        {c.title}
                        {c.status === 'pending' && ' · pendiente'}
                      </span>
                    ))}
                  </div>
                )}

                {u.courses.length === 0 && (
                  <p className="text-[12px] text-[#86868b] mt-1.5">Sin cursos adquiridos</p>
                )}
              </div>

              <button
                onClick={() => deleteUser(u.id, u.email)}
                className="shrink-0 text-[12px] font-medium text-red-400 hover:text-red-600 transition-colors mt-0.5"
                title="Eliminar cuenta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
