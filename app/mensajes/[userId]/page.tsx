'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { createClient } from '@/lib/supabase/client'
import { Search, Paperclip, Send, ArrowLeft } from 'lucide-react'

interface Mensaje {
  id: string; de: string; para: string; contenido: string; leido: boolean; created_at: string
}
interface Conversacion {
  otroId: string; nombre: string; email: string; ultimoMensaje: string; ultimaFecha: string; noLeidos: number
}

export default function ConversacionPage() {
  const { userId: otroId } = useParams<{ userId: string }>()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [convs, setConvs] = useState<Conversacion[]>([])
  const [otro, setOtro] = useState<{ nombre: string; email: string } | null>(null)
  const [miId, setMiId] = useState('')
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')

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
      if (!user) { router.replace('/login'); return }
      setUserEmail(user.email ?? '')
      setUserName(user.user_metadata?.full_name ?? '')
      cargar()
      fetch('/api/mensajes').then(r => r.json()).then(d => setConvs(d.conversaciones ?? []))
    })
  }, [otroId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensajes])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || sending) return
    setSending(true)
    await fetch('/api/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ para: otroId, contenido: texto.trim() }),
    })
    setTexto(''); await cargar(); setSending(false)
  }

  const formatHora = (d: string) => new Date(d).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  const formatFecha = (d: string) => new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long' })

  let ultimaFecha = ''

  return (
    <AppLayout userEmail={userEmail} userName={userName}>
      <div className="flex h-screen overflow-hidden">

      {/* Bandeja lateral */}
      <div
        className="hidden md:flex flex-col"
        style={{ marginLeft: 210, width: 260, background: 'white', borderRight: '1px solid var(--eclat-border)', flexShrink: 0 }}
      >
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
          <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--eclat-text)' }}>Conversaciones</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--eclat-bg-green)', border: '1px solid var(--eclat-border)' }}>
            <Search size={11} style={{ color: 'var(--eclat-text-3)' }} />
            <input placeholder="Buscar..." className="flex-1 bg-transparent text-[11px] outline-none" style={{ color: 'var(--eclat-text)' }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convs.map(conv => (
            <Link
              key={conv.otroId}
              href={`/mensajes/${conv.otroId}`}
              className="flex items-start gap-3 px-4 py-3 transition-colors"
              style={{
                borderBottom: '1px solid var(--eclat-border)',
                borderLeft: conv.otroId === otroId ? `3px solid var(--eclat-mid)` : '3px solid transparent',
                background: conv.otroId === otroId ? '#f0f7f2' : 'white',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ background: 'var(--eclat-dark)', color: 'white' }}>
                {conv.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--eclat-text)' }}>{conv.nombre}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--eclat-text-3)' }}>{conv.ultimoMensaje}</p>
              </div>
              {conv.noLeidos > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: 'var(--eclat-mid)', color: 'white' }}>
                  {conv.noLeidos}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Conversación */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: window?.innerWidth < 768 ? 210 : 0 }}>
        {/* Header conversación */}
        <div
          className="flex items-center gap-3 px-5 py-3 shrink-0"
          style={{ background: 'white', borderBottom: '1px solid var(--eclat-border)' }}
        >
          <Link href="/mensajes" className="md:hidden" style={{ color: 'var(--eclat-text-3)' }}>
            <ArrowLeft size={18} />
          </Link>
          {otro && (
            <>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0" style={{ background: 'var(--eclat-dark)', color: 'white' }}>
                {otro.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>{otro.nombre}</p>
                <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{otro.email}</p>
              </div>
            </>
          )}
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1" style={{ background: 'var(--eclat-cream)' }}>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--eclat-light)' }} />
            </div>
          ) : mensajes.map(m => {
            const esMio = m.de === miId
            const fecha = formatFecha(m.created_at)
            const mostrarFecha = fecha !== ultimaFecha
            ultimaFecha = fecha

            return (
              <div key={m.id}>
                {mostrarFecha && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{ background: 'var(--eclat-border)' }} />
                    <span className="text-[10px] px-3" style={{ color: 'var(--eclat-text-4)' }}>{fecha}</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--eclat-border)' }} />
                  </div>
                )}
                <div className={`flex mb-1 ${esMio ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%]">
                    <div
                      className="px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                      style={esMio
                        ? { background: 'var(--eclat-dark)', color: '#d4e0d8', borderBottomRightRadius: 4 }
                        : { background: 'white', color: 'var(--eclat-text)', border: '1px solid var(--eclat-border)', borderBottomLeftRadius: 4 }
                      }
                    >
                      {m.contenido}
                    </div>
                    <p className={`text-[10px] mt-0.5 px-1 ${esMio ? 'text-right' : 'text-left'}`} style={{ color: 'var(--eclat-text-4)' }}>
                      {formatHora(m.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-3 shrink-0" style={{ background: 'white', borderTop: '1px solid var(--eclat-border)' }}>
          <form onSubmit={enviar} className="flex items-end gap-2">
            <button type="button" className="shrink-0 p-2" style={{ color: 'var(--eclat-text-4)' }}>
              <Paperclip size={16} />
            </button>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(e as any) } }}
              placeholder="Escribí un mensaje..."
              rows={1}
              className="flex-1 resize-none text-[13px] outline-none max-h-28"
              style={{ color: 'var(--eclat-text)', background: 'transparent' }}
            />
            <button
              type="submit"
              disabled={!texto.trim() || sending}
              className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: 'var(--eclat-dark)', color: 'white' }}
            >
              {sending ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      </div>
      </div>
    </AppLayout>
  )
}
