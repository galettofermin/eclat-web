'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

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

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login?redirect=/mensajes'); return }
      fetch('/api/mensajes')
        .then(r => r.json())
        .then(d => { setConvs(d.conversaciones ?? []); setLoading(false) })
    })
  }, [router])

  const formatFecha = (d: string) => {
    const date = new Date(d)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    if (diff < 86400000) return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    if (diff < 604800000) return date.toLocaleDateString('es-AR', { weekday: 'short' })
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-[#0A0A0A]">Mensajes</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Conversaciones con el equipo ÉCLAT</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : convs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#DCEFE8] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-[#0A0A0A] mb-2">Sin mensajes todavía</p>
            <p className="text-[14px] text-[#6E6E73]">Cuando el equipo te escriba, verás los mensajes acá.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm divide-y divide-black/[0.04]">
            {convs.map(conv => (
              <Link
                key={conv.otroId}
                href={`/mensajes/${conv.otroId}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#1B2B26] flex items-center justify-center shrink-0 text-white font-semibold text-[15px]">
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
        )}
      </div>
      <Footer />
    </main>
  )
}
