'use client'
import { useState } from 'react'

interface Articulo {
  id: string
  title: string
  category: string
}

interface Props {
  /** Si se pasa un artículo, viene pre-seleccionado (desde la edición de un escrito) */
  articuloPreseleccionado?: Articulo
  /** Todos los artículos publicados para que el admin elija */
  articulos: Articulo[]
}

export default function NewsletterSender({ articuloPreseleccionado, articulos }: Props) {
  const [open, setOpen] = useState(false)
  const [asunto, setAsunto] = useState(
    articuloPreseleccionado ? `Nuevo en ÉCLAT: ${articuloPreseleccionado.title}` : ''
  )
  const [intro, setIntro] = useState('')
  const [seleccionados, setSeleccionados] = useState<string[]>(
    articuloPreseleccionado ? [articuloPreseleccionado.id] : []
  )
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<{ enviados: number; errores: number } | null>(null)
  const [error, setError] = useState('')

  const toggleArticulo = (id: string) =>
    setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleEnviar = async () => {
    if (!asunto.trim() || seleccionados.length === 0) {
      setError('Completá el asunto y seleccioná al menos un artículo')
      return
    }
    setLoading(true); setError('')
    const res = await fetch('/api/newsletter/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asunto, intro, articuloIds: seleccionados }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error ?? 'Error al enviar'); return }
    setResultado(json)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#1B2B26] text-white font-semibold text-[13px] px-4 py-2.5 rounded-full hover:bg-[#243d35] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Enviar a suscriptores
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#0A0A0A]">Enviar newsletter</h2>
            <p className="text-[13px] text-[#6E6E73] mt-0.5">Se enviará a todos los suscriptores activos</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-[#6E6E73] hover:text-[#0A0A0A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {resultado ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-[#DCEFE8] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-[18px] font-semibold text-[#0A0A0A] mb-2">¡Newsletter enviado!</p>
            <p className="text-[14px] text-[#6E6E73]">
              {resultado.enviados} mail{resultado.enviados !== 1 ? 's' : ''} enviado{resultado.enviados !== 1 ? 's' : ''}
              {resultado.errores > 0 && ` · ${resultado.errores} con error`}
            </p>
            <button
              onClick={() => { setOpen(false); setResultado(null) }}
              className="mt-6 bg-[#2F7D6B] text-white font-semibold px-6 py-2.5 rounded-full text-[14px] hover:bg-[#245f52] transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Asunto */}
            <div>
              <label className="block text-[12px] font-semibold text-[#0A0A0A] mb-1.5 uppercase tracking-wide">Asunto del mail *</label>
              <input
                type="text"
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                placeholder="Ej: Nuevo artículo · Junio en ÉCLAT"
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              />
            </div>

            {/* Intro opcional */}
            <div>
              <label className="block text-[12px] font-semibold text-[#0A0A0A] mb-1.5 uppercase tracking-wide">
                Mensaje de bienvenida <span className="font-normal text-[#86868b] normal-case">(opcional)</span>
              </label>
              <textarea
                rows={3}
                value={intro}
                onChange={e => setIntro(e.target.value)}
                placeholder="Ej: Este mes compartimos un nuevo artículo sobre inclusión escolar..."
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
              />
            </div>

            {/* Artículos */}
            <div>
              <label className="block text-[12px] font-semibold text-[#0A0A0A] mb-2 uppercase tracking-wide">
                Artículos a incluir *
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {articulos.map(art => (
                  <label key={art.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#F5F9F7] transition-colors border border-transparent hover:border-[#2F7D6B]/20">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(art.id)}
                      onChange={() => toggleArticulo(art.id)}
                      className="mt-0.5 w-4 h-4 accent-[#2F7D6B] rounded shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[#0A0A0A] leading-snug">{art.title}</p>
                      <p className="text-[11px] text-[#86868b] mt-0.5">{art.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2 border-t border-black/5">
              <button
                onClick={handleEnviar}
                disabled={loading}
                className="bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[14px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar newsletter'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-[14px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
