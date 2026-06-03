'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service, Servicio } from '@/lib/types'

export default function AdminServicios() {
  const [services, setServices] = useState<Service[]>([])
  const [serviciosData, setServiciosData] = useState<Servicio[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAll = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setServices(data ?? [])

    try {
      const res = await fetch('/api/servicios')
      const servicios = await res.json()
      setServiciosData(Array.isArray(servicios) ? servicios : [])
    } catch {}

    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const getServicio = (title: string) =>
    serviciosData.find(s => s.nombre === title)

  const handleEdit = (service: Service) => {
    setEditing({ ...service })
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .update({ title: editing.title, description: editing.description, sort_order: editing.sort_order })
      .eq('id', editing.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Guardado correctamente.')
      setEditing(null)
      fetchAll()
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    serviceTitle: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const servicio = getServicio(serviceTitle)
    if (!servicio) {
      setError('Este servicio no tiene entrada en la tabla de imágenes. Verificá que el nombre coincida exactamente.')
      return
    }

    setUploading(servicio.id)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('nombre', serviceTitle)

      const uploadRes = await fetch('/api/servicios/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error)

      const putRes = await fetch('/api/servicios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: servicio.id, imagen_url: uploadData.url }),
      })
      if (!putRes.ok) throw new Error('Error al guardar imagen')

      setServiciosData(prev =>
        prev.map(s => s.id === servicio.id ? { ...s, imagen_url: uploadData.url } : s)
      )
      setSuccess('Imagen actualizada.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message ?? 'Error al subir imagen')
    } finally {
      setUploading(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#0A0A0A] mb-1">Servicios</h1>
      <p className="text-[15px] text-[#6E6E73] mb-8">Editá los títulos, descripciones e imágenes de cada servicio</p>

      {success && (
        <div className="mb-6 px-4 py-3 bg-[#DCEFE8] text-[#2F7D6B] rounded-xl text-[14px] font-medium">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => {
            const servicio = getServicio(s.title)
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-black/5 p-5">
                {editing?.id === s.id ? (
                  <div className="space-y-3">
                    {/* Título */}
                    <input
                      type="text"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[15px] font-semibold focus:outline-none focus:border-[#2F7D6B] transition-colors"
                    />

                    {/* Descripción */}
                    <textarea
                      rows={3}
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
                    />

                    {/* Imagen */}
                    <div>
                      <label className="block text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide mb-2">
                        Imagen del servicio
                      </label>
                      {servicio?.imagen_url && (
                        <img
                          src={servicio.imagen_url}
                          alt={s.title}
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                            marginBottom: 8,
                          }}
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, s.title)}
                          className="text-[13px] text-[#6E6E73] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-medium file:bg-[#e8f0ea] file:text-[#3a5444] file:cursor-pointer"
                        />
                        {uploading === servicio?.id && (
                          <span className="flex items-center gap-1.5 text-[12px] text-[#2F7D6B]">
                            <span className="w-3.5 h-3.5 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin inline-block" />
                            Subiendo…
                          </span>
                        )}
                      </div>
                      {!servicio && (
                        <p className="text-[11px] text-amber-600 mt-1">
                          Sin entrada en tabla de imágenes. Verificá que el nombre del servicio coincida.
                        </p>
                      )}
                    </div>

                    {error && <p className="text-[13px] text-red-500">{error}</p>}

                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#2F7D6B] text-white font-semibold px-5 py-2 rounded-full text-[13px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
                      >
                        {saving ? 'Guardando...' : 'Guardar texto'}
                      </button>
                      <button
                        onClick={() => { setEditing(null); setError('') }}
                        className="text-[13px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    {/* Miniatura si tiene imagen */}
                    {servicio?.imagen_url && (
                      <img
                        src={servicio.imagen_url}
                        alt={s.title}
                        style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#0A0A0A] mb-1">{s.title}</p>
                      <p className="text-[14px] text-[#6E6E73] leading-relaxed">{s.description}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-[13px] font-medium text-[#2F7D6B] hover:underline shrink-0"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
