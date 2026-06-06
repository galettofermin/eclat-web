'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/lib/types'

const CATEGORIES = [
  'Clínica', 'Infancia', 'Aprendizaje', 'Fonoaudiología',
  'Psicomotricidad', 'Interdisciplina', 'Familias', 'Salud mental',
]

export default function ArticleForm({ article }: { article?: Article }) {
  const isEditing = !!article
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title:     article?.title     ?? '',
    category:  article?.category  ?? 'Clínica',
    excerpt:   article?.excerpt   ?? '',
    content:   article?.content   ?? '',
    image_url: article?.image_url ?? '',
    read_time: article?.read_time ?? '5 min',
    featured:  article?.featured  ?? false,
    published: article?.published ?? true,
  })
  const [loading,        setLoading]        = useState(false)
  const [uploading,      setUploading]      = useState(false)
  const [error,          setError]          = useState('')
  const [uploadError,    setUploadError]    = useState('')

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')

    const fd = new FormData()
    fd.append('file', file)

    const res  = await fetch('/api/articulos/upload', { method: 'POST', body: fd })
    const json = await res.json()

    if (!res.ok || json.error) {
      setUploadError(json.error ?? 'Error al subir la imagen')
    } else {
      set('image_url', json.url)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error } = isEditing
      ? await supabase.from('articles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', article.id)
      : await supabase.from('articles').insert(form)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/escritos')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Título *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
          placeholder="Título del escrito"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Categoría</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Tiempo de lectura</label>
          <input
            type="text"
            value={form.read_time}
            onChange={(e) => set('read_time', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
            placeholder="5 min"
          />
        </div>
      </div>

      {/* Imagen de portada */}
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Imagen de portada</label>
        {form.image_url && (
          <div className="mb-2 relative w-full h-40 rounded-xl overflow-hidden border border-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="Portada" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { set('image_url', ''); if (fileRef.current) fileRef.current.value = '' }}
              className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-lg hover:bg-black/80 transition-colors"
            >
              Quitar
            </button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImage}
          className="w-full text-[14px] text-[#6E6E73] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-[#2F7D6B]/10 file:text-[#2F7D6B] hover:file:bg-[#2F7D6B]/20 transition-colors cursor-pointer"
        />
        {uploading && <p className="text-[13px] text-[#6E6E73] mt-1">Subiendo imagen...</p>}
        {uploadError && <p className="text-[13px] text-red-500 mt-1">{uploadError}</p>}
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Bajada / Resumen *</label>
        <textarea
          required
          rows={3}
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
          placeholder="Un párrafo breve que aparece en la grilla de artículos"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Contenido completo</label>
        <textarea
          rows={14}
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
          placeholder="Texto completo del artículo..."
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="w-4 h-4 accent-[#2F7D6B] rounded"
          />
          <span className="text-[14px] font-medium text-[#0A0A0A]">Artículo destacado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set('published', e.target.checked)}
            className="w-4 h-4 accent-[#2F7D6B] rounded"
          />
          <span className="text-[14px] font-medium text-[#0A0A0A]">Publicado</span>
        </label>
      </div>

      {error && (
        <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-black/5">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-[#2F7D6B] text-white font-semibold px-8 py-3 rounded-full text-[15px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Publicar escrito'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[15px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
