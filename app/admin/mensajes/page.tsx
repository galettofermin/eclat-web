'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { DIRECTOR_EMAIL } from '@/lib/constants'

interface Conversacion {
  otroId: string
  nombre: string
  email: string
  ultimoMensaje: string
  ultimaFecha: string
  noLeidos: number
}

interface Alumno {
  id: string
  email: string
  name: string
}

export default function AdminMensajes() {
  const [convs, setConvs] = useState<Conversacion[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bandeja' | 'nueva'>('bandeja')
  const [busqueda, setBusqueda] = useState('')
  const [directorId, setDirectorId] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setDirectorId(user.id)
    })

    Promise.all([
      fetch('/api/mensajes').then(r => r.json()),
      fetch('/api/admin/usuarios').then(r => r.json()),
    ]).then(([mensData, usersData]) => {
      setConvs(mensData.conversaciones ?? [])
      setAlumnos(usersData.users ?? [])
      setLoading(false)
    })
  }, [])

  const formatFecha = (d: string) => {
    const date = new Date(d)
    const diff = Date.now() - date.getTime()
    if (diff < 86400000) return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    if (diff < 604800000) return date.toLocaleDateString('es-AR', { weekday: 'short' })
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
  }

  const alumnosFiltrados = alumnos.filter(a =>
    a.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalNoLeidos = convs.reduce((acc, c) => acc + c.noLeidos, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Mensajes</h1>
          <p className="text-[15px] text-[#6E6E73]">
            {totalNoLeidos > 0 ? `${totalNoLeidos} sin leer` : 'Bandeja al día'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['bandeja', 'nueva'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              tab === t ? 'bg-[#2F7D6B] text-white' : 'bg-white border border-black/10 text-[#424245] hover:border-[#2F7D6B]/40'
            }`}
          >
            {t === 'bandeja' ? `Conversaciones${totalNoLeidos > 0 ? ` (${totalNoLeidos})` : ''}` : 'Escribir a alumno'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'bandeja' ? (
        convs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
            <p className="text-[16px] text-[#6E6E73]">No hay conversaciones todavía.</p>
            <button onClick={() => setTab('nueva')} className="mt-4 text-[14px] font-semibold text-[#2F7D6B] hover:underline">
              Escribir al primer alumno →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm divide-y divide-black/[0.04]">
            {convs.map(conv => (
              <Link
                key={conv.otroId}
                href={`/admin/mensajes/${conv.otroId}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#DCEFE8] flex items-center justify-center text-[#2F7D6B] font-semibold text-[14px] shrink-0">
                  {conv.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#0A0A0A] truncate">{conv.nombre}</p>
                    <span className="text-[11px] text-[#6E6E73] shrink-0">{formatFecha(conv.ultimaFecha)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-[13px] text-[#6E6E73] truncate">{conv.ultimoMensaje}</p>
                    {conv.noLeidos > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#2F7D6B] text-white text-[11px] font-bold flex items-center justify-center">
                        {conv.noLeidos > 9 ? '9+' : conv.noLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        /* Lista de alumnos para iniciar conversación */
        <div>
          <div className="relative mb-4">
            <svg width="16" height="16" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar alumno..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
            />
          </div>
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm divide-y divide-black/[0.04]">
            {alumnosFiltrados.length === 0 ? (
              <p className="text-[14px] text-[#6E6E73] text-center py-8">No se encontraron alumnos.</p>
            ) : (
              alumnosFiltrados.map(a => (
                <Link
                  key={a.id}
                  href={`/admin/mensajes/${a.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#DCEFE8] flex items-center justify-center text-[#2F7D6B] font-semibold text-[14px] shrink-0">
                    {(a.name || a.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0A0A0A]">{a.name || '—'}</p>
                    <p className="text-[13px] text-[#6E6E73] truncate">{a.email}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
