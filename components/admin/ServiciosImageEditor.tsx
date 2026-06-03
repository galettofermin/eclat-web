'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Servicio } from '@/lib/types'

function ServicioCard({
  servicio,
  onUpdate,
}: {
  servicio: Servicio
  onUpdate: (id: number, url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setDone(false)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('nombre', servicio.nombre)

      const uploadRes = await fetch('/api/servicios/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error)

      const putRes = await fetch('/api/servicios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: servicio.id, imagen_url: uploadData.url }),
      })
      if (!putRes.ok) throw new Error('Error al guardar')

      onUpdate(servicio.id, uploadData.url)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err: any) {
      setError(err.message ?? 'Error al subir')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col items-center gap-3"
      style={{ border: '1px solid var(--eclat-border)' }}
    >
      {/* Imagen o placeholder */}
      <div
        className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
        style={{ background: '#e4efe6' }}
      >
        {servicio.imagen_url ? (
          <Image
            src={servicio.imagen_url}
            alt={servicio.nombre}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span style={{ fontSize: 28 }}>🖼️</span>
        )}
      </div>

      {/* Nombre */}
      <p className="text-[12px] font-medium text-center leading-snug" style={{ color: 'var(--eclat-text)' }}>
        {servicio.nombre}
      </p>

      {/* Estado */}
      {done && (
        <span className="text-[11px] font-medium" style={{ color: '#3a5444' }}>✓ Actualizado</span>
      )}
      {error && (
        <span className="text-[11px]" style={{ color: '#c53030' }}>{error}</span>
      )}

      {/* Botón */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{ border: '1px solid var(--eclat-dark-3)', color: 'var(--eclat-dark-3)' }}
      >
        {uploading ? (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
            Subiendo…
          </span>
        ) : (
          'Cambiar imagen'
        )}
      </button>
    </div>
  )
}

export default function ServiciosImageEditor() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/servicios')
      .then(r => r.json())
      .then(data => { setServicios(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleUpdate = (id: number, url: string) => {
    setServicios(prev => prev.map(s => s.id === id ? { ...s, imagen_url: url } : s))
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--eclat-border)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
        <h2 className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Servicios — imágenes</h2>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--eclat-text-3)' }}>
          Subí una imagen por servicio. Se muestra en el carrusel del home.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--eclat-border)', borderTopColor: 'var(--eclat-dark)' }} />
        </div>
      ) : servicios.length === 0 ? (
        <p className="text-[13px] px-5 py-8 text-center" style={{ color: 'var(--eclat-text-3)' }}>
          No hay servicios. Ejecutá el SQL de inicialización en Supabase.
        </p>
      ) : (
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {servicios.map(s => (
            <ServicioCard key={s.id} servicio={s} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
