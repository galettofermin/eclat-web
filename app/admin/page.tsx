'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import RegistrationsTab from '@/components/admin/RegistrationsTab'

interface Stats {
  inscripcionesPendientes: number
  alumnosActivos: number
  suscriptores: number
  escritosPublicados: number
  formaciones: number
  mensajesNoLeidos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    inscripcionesPendientes: 0,
    alumnosActivos: 0,
    suscriptores: 0,
    escritosPublicados: 0,
    formaciones: 0,
    mensajesNoLeidos: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [
        { count: pendientes },
        { count: alumnos },
        { count: suscriptores },
        { count: escritos },
        { count: formaciones },
      ] = await Promise.all([
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('suscriptores').select('*', { count: 'exact', head: true }).eq('activo', true),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('published', true),
      ])

      // Mensajes no leídos via API
      let noLeidos = 0
      try {
        const r = await fetch('/api/mensajes')
        const d = await r.json()
        noLeidos = (d.conversaciones ?? []).reduce(
          (acc: number, c: { noLeidos: number }) => acc + c.noLeidos, 0
        )
      } catch {}

      setStats({
        inscripcionesPendientes: pendientes ?? 0,
        alumnosActivos: alumnos ?? 0,
        suscriptores: suscriptores ?? 0,
        escritosPublicados: escritos ?? 0,
        formaciones: formaciones ?? 0,
        mensajesNoLeidos: noLeidos,
      })
      setPendingCount(pendientes ?? 0)
      setLoadingStats(false)
    }
    load()
  }, [])

  const STAT_CARDS = [
    {
      label: 'Inscripciones pendientes',
      value: stats.inscripcionesPendientes,
      href: '/admin/inscripciones',
      urgent: stats.inscripcionesPendientes > 0,
      icon: 'M9 11l3 3L22 4',
    },
    {
      label: 'Alumnos activos',
      value: stats.alumnosActivos,
      href: '/admin/usuarios',
      urgent: false,
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    },
    {
      label: 'Suscriptores',
      value: stats.suscriptores,
      href: '/admin/suscriptores',
      urgent: false,
      icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    },
    {
      label: 'Mensajes sin leer',
      value: stats.mensajesNoLeidos,
      href: '/admin/mensajes',
      urgent: stats.mensajesNoLeidos > 0,
      icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    },
    {
      label: 'Escritos publicados',
      value: stats.escritosPublicados,
      href: '/admin/escritos',
      urgent: false,
      icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
    },
    {
      label: 'Formaciones activas',
      value: stats.formaciones,
      href: '/admin/formacion',
      urgent: false,
      icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    },
  ]

  const QUICK_LINKS = [
    { href: '/admin/escritos/nuevo', label: 'Nuevo escrito', icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
    { href: '/admin/formacion/nuevo', label: 'Nueva formación', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
    { href: '/admin/configuracion', label: 'Editar textos', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
    { href: '/admin/mensajes', label: 'Ver mensajes', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Panel de administración</h1>
        <p className="text-[15px] text-[#6E6E73]">ÉCLAT Centro de Atención Integral</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 animate-pulse">
                <div className="h-8 w-12 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
            ))
          : STAT_CARDS.map(card => (
              <Link
                key={card.label}
                href={card.href}
                className={`group rounded-2xl border p-5 transition-all hover:shadow-sm ${
                  card.urgent
                    ? 'bg-[#FFF8F0] border-orange-200 hover:border-orange-300'
                    : 'bg-white border-black/5 hover:border-[#2F7D6B]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[32px] font-light leading-none ${
                    card.urgent ? 'text-orange-600' : 'text-[#0A0A0A]'
                  }`}>
                    {card.value}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={card.urgent ? '#ea580c' : '#86868b'}
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    className="mt-1 shrink-0"
                  >
                    <path d={card.icon} />
                  </svg>
                </div>
                <p className={`text-[12px] font-medium leading-snug ${
                  card.urgent ? 'text-orange-700' : 'text-[#6E6E73]'
                }`}>
                  {card.label}
                </p>
                {card.urgent && card.value > 0 && (
                  <p className="text-[11px] font-semibold text-orange-500 mt-1">Requiere atención →</p>
                )}
              </Link>
            ))}
      </div>

      {/* Accesos rápidos */}
      <div className="mb-8">
        <h2 className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-3">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 bg-white border border-black/[0.08] px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#424245] hover:border-[#2F7D6B]/40 hover:text-[#2F7D6B] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Solicitudes recientes — siempre visibles */}
      <div>
        <h2 className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-3">
          Solicitudes de ingreso
          {pendingCount > 0 && (
            <span className="ml-2 text-[11px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full normal-case tracking-normal">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <RegistrationsTab onError={setError} onPendingCount={setPendingCount} />
        </div>
        {error && (
          <p className="mt-3 text-[13px] text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}
