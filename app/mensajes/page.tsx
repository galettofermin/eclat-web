'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppSidebar from '@/components/AppSidebar'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'

interface Conversacion {
  otroId: string
  nombre: string
  email: string
  ultimoMensaje: string
  ultimaFecha: string
  noLeidos: number
}

export default function MensajesPage() {
  const router = useRouter()
  const [convs, setConvs] = useState<Conversacion[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login?redirect=/mensajes'); return }
      setUserEmail(user.email ?? '')
      setUserName(user.user_metadata?.full_name ?? '')
      fetch('/api/mensajes')
        .then(r => r.json())
        .then(d => { setConvs(d.conversaciones ?? []); setLoading(false) })
    })
  }, [router])

  const filtered = convs.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalNoLeidos = convs.reduce((a, c) => a + c.noLeidos, 0)

  const formatFecha = (d: string) => {
    const date = new Date(d)
    const diff = Date.now() - date.getTime()
    if (diff < 86400000) return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    if (diff < 604800000) return date.toLocaleDateString('es-AR', { weekday: 'short' })
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--eclat-cream)' }}>
      <AppSidebar userEmail={userEmail} userName={userName} />

      {/* Panel bandeja */}
      <div
        className="flex flex-col"
        style={{ marginLeft: 210, width: 280, background: 'white', borderRight: '1px solid var(--eclat-border)', flexShrink: 0 }}
      >
        {/* Header bandeja */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Conversaciones</p>
            {totalNoLeidos > 0 && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--eclat-dark)', color: 'white' }}
              >
                {totalNoLeidos}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--eclat-bg-green)', border: '1px solid var(--eclat-border)' }}
          >
            <Search size={12} style={{ color: 'var(--eclat-text-3)', flexShrink: 0 }} />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-[12px] outline-none"
              style={{ color: 'var(--eclat-text)' }}
            />
          </div>
        </div>

        {/* Lista conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--eclat-light)' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-[12px]" style={{ color: 'var(--eclat-text-3)' }}>
                {busqueda ? 'Sin resultados.' : 'No hay conversaciones.'}
              </p>
            </div>
          ) : (
            filtered.map(conv => (
              <Link
                key={conv.otroId}
                href={`/mensajes/${conv.otroId}`}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:opacity-80"
                style={{ borderBottom: '1px solid var(--eclat-border)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                  style={{ background: 'var(--eclat-dark)', color: 'white' }}
                >
                  {conv.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--eclat-text)' }}>{conv.nombre}</p>
                    <span className="text-[10px] shrink-0" style={{ color: 'var(--eclat-text-4)' }}>{formatFecha(conv.ultimaFecha)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[11px] truncate" style={{ color: 'var(--eclat-text-3)' }}>{conv.ultimoMensaje}</p>
                    {conv.noLeidos > 0 && (
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: 'var(--eclat-mid)', color: 'white' }}
                      >
                        {conv.noLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Panel vacío / placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[28px] mb-2" style={{ opacity: 0.3 }}>💬</p>
          <p className="text-[13px]" style={{ color: 'var(--eclat-text-3)' }}>Seleccioná una conversación</p>
        </div>
      </div>
    </div>
  )
}
