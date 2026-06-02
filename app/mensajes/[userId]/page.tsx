'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'

interface Mensaje {
  id: string
  de: string
  para: string
  contenido: string
  leido: boolean
  created_at: string
}

interface Otro {
  id: string
  nombre: string
  email: string
}

export default function ConversacionPage() {
  const { userId: otroId } = useParams<{ userId: string }>()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [otro, setOtro] = useState<Otro | null>(null)
  const [miId, setMiId] = useState('')
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const cargar = async () => {
    const res = await fetch(`/api/mensajes/${otroId}`)
    const data = await res.json()
    setMensajes(data.mensajes ?? [])
    setOtro(data.otro)
    setMiId(data.yo?.id ?? '')
    setLoading(false)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login?redirect=/mensajes'); return }
      cargar()
    })
  }, [otroId, router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ para: otroId, contenido: texto.trim() }),
    })
    if (res.ok) {
      setTexto('')
      await cargar()
    }
    setSending(false)
  }

  const formatHora = (d: string) =>
    new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

  const formatFecha = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Agrupar mensajes por fecha
  let ultimaFecha = ''

  return (
    <main className="flex flex-col h-screen bg-[#F5F5F7]">
      <Navbar />

      {/* Header de conversación */}
      <div className="fixed top-[60px] inset-x-0 z-40 bg-white border-b border-black/[0.06] px-5 py-3 flex items-center gap-3 shadow-sm">
        <Link href="/mensajes" className="text-[#6E6E73] hover:text-[#0A0A0A] transition-colors mr-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </Link>
        {otro && (
          <>
            <div className="w-9 h-9 rounded-full bg-[#1B2B26] flex items-center justify-center text-white font-semibold text-[14px] shrink-0">
              {otro.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0A0A0A] leading-tight">{otro.nombre}</p>
              <p className="text-[12px] text-[#6E6E73]">{otro.email}</p>
            </div>
          </>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto pt-[120px] pb-[80px] px-4 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px] text-[#6E6E73]">Iniciá la conversación.</p>
          </div>
        ) : (
          mensajes.map((m) => {
            const esMio = m.de === miId
            const fecha = formatFecha(m.created_at)
            const mostrarFecha = fecha !== ultimaFecha
            ultimaFecha = fecha

            return (
              <div key={m.id}>
                {mostrarFecha && (
                  <div className="text-center my-4">
                    <span className="text-[11px] text-[#6E6E73] bg-[#EBEBEB] px-3 py-1 rounded-full">{fecha}</span>
                  </div>
                )}
                <div className={`flex mb-2 ${esMio ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${esMio ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                      esMio
                        ? 'bg-[#2F7D6B] text-white rounded-br-md'
                        : 'bg-white text-[#0A0A0A] border border-black/[0.06] rounded-bl-md'
                    }`}>
                      {m.contenido}
                    </div>
                    <span className="text-[11px] text-[#6E6E73] px-1">{formatHora(m.created_at)}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-black/[0.06] px-4 py-3">
        <form onSubmit={enviar} className="max-w-2xl mx-auto flex gap-2 items-end">
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(e as any) } }}
            placeholder="Escribí un mensaje..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.5' }}
          />
          <button
            type="submit"
            disabled={!texto.trim() || sending}
            className="w-10 h-10 bg-[#2F7D6B] text-white rounded-xl flex items-center justify-center hover:bg-[#245f52] disabled:opacity-50 transition-colors shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
