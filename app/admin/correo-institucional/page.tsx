'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Suscriptor { id: string; email: string; nombre: string | null; lista: string }

const LISTA_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  general:       { label: 'General',       color: '#2F7D6B', bg: '#e8f5f0' },
  pausa:         { label: 'Pausa',         color: '#7A6B2F', bg: '#f5f0e8' },
  profesionales: { label: 'Prof.',         color: '#1B2B26', bg: '#d4e0da' },
}

const SITE_URL = 'https://eclatcentro.com'
const FONT = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"

export default function CorreoInstitucional() {
  const [asunto, setAsunto] = useState('')
  const [texto, setTexto] = useState('')
  const [destEmail, setDestEmail] = useState('')
  const [destNombre, setDestNombre] = useState('')
  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ ok: boolean; msg: string } | null>(null)

  // Imagen
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const imagenRef = useRef<HTMLInputElement | null>(null)

  // PDF
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const pdfRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('suscriptores').select('id, email, nombre, lista').eq('activo', true).order('nombre')
      .then(({ data }) => setSuscriptores(data ?? []))
  }, [])

  const sugeridos = busqueda.trim().length > 0
    ? suscriptores.filter(s =>
        s.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.nombre ?? '').toLowerCase().includes(busqueda.toLowerCase())
      ).slice(0, 6)
    : []

  const seleccionarSuscriptor = (s: Suscriptor) => {
    setDestEmail(s.email)
    setDestNombre(s.nombre ?? '')
    setBusqueda('')
  }

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagenFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfFile(file)
  }

  const subirArchivo = async (file: File, tipo: 'imagen' | 'pdf'): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    const endpoint = tipo === 'pdf'
      ? '/api/admin/newsletter/upload-pdf'
      : '/api/admin/newsletter/upload-imagen'
    const res = await fetch(endpoint, { method: 'POST', body: fd })
    const data = await res.json()
    if (!data.url) throw new Error(data.error ?? 'Error al subir archivo')
    return data.url
  }

  const handleEnviar = async () => {
    if (!asunto.trim() || !texto.trim() || !destEmail.trim()) return
    setEnviando(true)
    setResultado(null)
    try {
      let imagenUrl: string | undefined
      let pdfUrl: string | undefined
      let pdfNombre: string | undefined

      if (imagenFile) imagenUrl = await subirArchivo(imagenFile, 'imagen')
      if (pdfFile) {
        pdfUrl = await subirArchivo(pdfFile, 'pdf')
        pdfNombre = pdfFile.name
      }

      const res = await fetch('/api/admin/correo-institucional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asunto, texto,
          destinatarioEmail: destEmail,
          destinatarioNombre: destNombre,
          imagenUrl, pdfUrl, pdfNombre,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setResultado({ ok: true, msg: '✅ Correo enviado correctamente' })
        setAsunto(''); setTexto(''); setDestEmail(''); setDestNombre('')
        setImagenFile(null); setImagenPreview(null); setPdfFile(null)
      } else {
        setResultado({ ok: false, msg: `❌ Error: ${data.error}` })
      }
    } catch (e: unknown) {
      setResultado({ ok: false, msg: `❌ ${e instanceof Error ? e.message : 'Error de red'}` })
    } finally {
      setEnviando(false)
    }
  }

  const listo = asunto.trim() && texto.trim() && destEmail.trim()
  const parrafos = texto.split(/\n\n+/).map(p => p.trim()).filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Correo institucional</h1>
        <p className="text-[15px] text-[#6E6E73] mt-1">Enviá un mail profesional a una institución o persona puntual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── Formulario ── */}
        <div className="space-y-5">

          {/* Destinatario */}
          <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
            <h2 className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-widest">Destinatario</h2>
            <div className="relative">
              <input type="text" placeholder="Buscar entre suscriptores..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors" />
              {sugeridos.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden">
                  {sugeridos.map(s => (
                    <button key={s.id} type="button" onClick={() => seleccionarSuscriptor(s)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F4F8F6] transition-colors flex items-center gap-3 border-b border-black/5 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#0A0A0A] truncate">{s.nombre ?? s.email}</p>
                        <p className="text-[12px] text-[#6E6E73] truncate">{s.email}</p>
                      </div>
                      {s.lista && LISTA_CONFIG[s.lista] && (
                        <span style={{ background: LISTA_CONFIG[s.lista].bg, color: LISTA_CONFIG[s.lista].color }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {LISTA_CONFIG[s.lista].label}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">Nombre</label>
                <input type="text" placeholder="Ej: Dra. García"
                  value={destNombre} onChange={e => setDestNombre(e.target.value)}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">Email *</label>
                <input type="email" placeholder="correo@institución.com"
                  value={destEmail} onChange={e => setDestEmail(e.target.value)}
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors" />
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
            <h2 className="text-[13px] font-semibold text-[#6E6E73] uppercase tracking-widest">Contenido</h2>

            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">Asunto *</label>
              <input type="text" placeholder="Ej: Derivación — Paciente Juan Pérez"
                value={asunto} onChange={e => setAsunto(e.target.value)}
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors" />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#6E6E73] mb-1">Cuerpo del mensaje *</label>
              <textarea
                placeholder={"Escribí el contenido del correo...\n\nDoble enter = nuevo párrafo.\n\nFirmá al final con tu nombre y cargo."}
                value={texto} onChange={e => setTexto(e.target.value)}
                rows={10}
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none leading-relaxed" />
            </div>

            {/* Adjuntos */}
            <div className="space-y-3 pt-1">
              <p className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-widest">Adjuntos</p>

              {/* Imagen */}
              <div>
                <input ref={imagenRef} type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
                {imagenPreview ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F4F8F6] rounded-xl border border-[#c5ddd7]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagenPreview} alt="preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <p className="text-[13px] text-[#1B2B26] font-medium flex-1 truncate">{imagenFile?.name}</p>
                    <button type="button" onClick={() => { setImagenFile(null); setImagenPreview(null) }}
                      className="text-[#9CA8A3] hover:text-red-400 transition-colors text-lg leading-none">×</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => imagenRef.current?.click()}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-black/15 text-[13px] text-[#6E6E73] hover:border-[#2F7D6B] hover:text-[#2F7D6B] transition-colors">
                    🖼️ Adjuntar imagen
                  </button>
                )}
              </div>

              {/* PDF */}
              <div>
                <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                {pdfFile ? (
                  <div className="flex items-center gap-3 p-3 bg-[#F4F8F6] rounded-xl border border-[#c5ddd7]">
                    <span className="text-xl shrink-0">📄</span>
                    <p className="text-[13px] text-[#1B2B26] font-medium flex-1 truncate">{pdfFile.name}</p>
                    <button type="button" onClick={() => setPdfFile(null)}
                      className="text-[#9CA8A3] hover:text-red-400 transition-colors text-lg leading-none">×</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => pdfRef.current?.click()}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-black/15 text-[13px] text-[#6E6E73] hover:border-[#2F7D6B] hover:text-[#2F7D6B] transition-colors">
                    📄 Adjuntar PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {resultado && (
            <p className={`text-[13px] px-4 py-3 rounded-xl border ${resultado.ok
              ? 'text-[#2F7D6B] bg-[#EDF3F0] border-[#c5ddd7]'
              : 'text-red-600 bg-red-50 border-red-100'}`}>
              {resultado.msg}
            </p>
          )}

          <button onClick={handleEnviar} disabled={!listo || enviando}
            className="w-full bg-[#1B2B26] text-white font-semibold px-8 py-4 rounded-2xl text-[15px] hover:bg-[#2F7D6B] disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
            {enviando ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando...</>
            ) : '✉️ Enviar correo'}
          </button>
        </div>

        {/* ── Preview ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E8EDE9]" />
            <span className="text-[11px] font-bold text-[#9CA8A3] uppercase tracking-widest whitespace-nowrap">Preview del email</span>
            <div className="flex-1 h-px bg-[#E8EDE9]" />
          </div>

          {!asunto && !texto ? (
            <div className="text-center py-12 bg-[#F9FAF9] rounded-2xl border-2 border-dashed border-[#D4DDD9]">
              <div className="text-2xl mb-2">✉️</div>
              <p className="text-[13px] text-[#9CA8A3]">Completá el asunto y el mensaje para ver la preview</p>
            </div>
          ) : (
            <div style={{ background: '#e0e7dc', borderRadius: 12, padding: '32px 16px', fontFamily: FONT }}>
              <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 12px rgba(27,43,38,0.10)' }}>
                {/* Header */}
                <div style={{ background: '#fff', padding: '28px 40px 0', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${SITE_URL}/logo-eclat.png`} alt="ÉCLAT" width={80} height={80}
                    style={{ display: 'block', margin: '0 auto 22px', width: 80, height: 80, objectFit: 'contain' }} />
                  <div style={{ height: 4, background: '#e0e7dc', margin: '0 -40px' }} />
                </div>

                {/* Contenido */}
                <div style={{ padding: '32px 40px 28px' }}>
                  <p style={{ color: '#1B2B26', fontSize: 15, fontWeight: 600, margin: '0 0 16px', fontFamily: FONT }}>
                    {destNombre ? `Hola ${destNombre.split(' ')[0]},` : 'Hola,'}
                  </p>
                  {asunto && (
                    <p style={{ color: '#1B2B26', fontSize: 22, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2, fontFamily: FONT }}>
                      {asunto}
                    </p>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid #D4E0DA', margin: '20px 0' }} />

                  {/* Imagen preview */}
                  {imagenPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagenPreview} alt="imagen"
                      style={{ width: '100%', borderRadius: 8, marginBottom: 12, display: 'block', maxHeight: 200, objectFit: 'cover' }} />
                  )}

                  {texto && (
                    <div style={{ background: '#F2F6F4', borderRadius: 8, padding: '16px 20px', borderLeft: '3px solid #2F7D6B' }}>
                      {parrafos.map((p, i) => (
                        <p key={i} style={{ fontSize: 14, color: '#1B2B26', lineHeight: 1.75, margin: '0 0 12px', fontFamily: FONT }}>{p}</p>
                      ))}
                      {pdfFile && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid #2F7D6B', borderRadius: 6, padding: '8px 16px', marginTop: 4, color: '#2F7D6B', fontSize: 12, fontWeight: 700, fontFamily: FONT }}>
                          📄 {pdfFile.name}
                        </div>
                      )}
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid #D4E0DA', margin: '24px 0 16px' }} />
                  <p style={{ fontSize: 13, color: '#7A9088', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                    Un saludo,<br />
                    <span style={{ color: '#2F7D6B', fontWeight: 700 }}>Equipo ÉCLAT · Centro de Atención Integral</span>
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '18px 16px 4px', maxWidth: 540, margin: '0 auto' }}>
                <p style={{ fontSize: 11, color: '#6B8A7E', margin: '0 0 3px', fontFamily: FONT }}>eclatcentro.com · WhatsApp · @eclatcentro</p>
                <p style={{ fontSize: 10, color: '#8AA89E', margin: 0, fontFamily: FONT }}>Castelli 260, Oncativo, Córdoba · Lun a Vie 8:30 a 20:30 h</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
