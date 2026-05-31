'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'
import ModulesEditor from './ModulesEditor'

export default function CourseForm({ course }: { course?: Course }) {
  const isEditing = !!course
  const router = useRouter()

  const [form, setForm] = useState({
    title: course?.title ?? '',
    description: course?.description ?? '',
    badge: course?.badge ?? 'Próximamente',
    badge_type: course?.badge_type ?? 'soon' as 'free' | 'soon',
    link: course?.link ?? '',
    cta: course?.cta ?? '',
    sort_order: course?.sort_order ?? 0,
    published: course?.published ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = { ...form, link: form.link || null, cta: form.cta || null }
    const supabase = createClient()

    if (isEditing) {
      const { error } = await supabase.from('courses').update(payload).eq('id', course.id)
      if (error) { setError(error.message); setLoading(false); return }
      setLoading(false)
    } else {
      const { data, error } = await supabase.from('courses').insert(payload).select().single()
      if (error) { setError(error.message); setLoading(false); return }
      // Redirect to edit page so modules can be managed
      router.push(`/admin/formacion/${data.id}`)
      return
    }
  }

  return (
    <div className="space-y-8">
      {/* Datos del curso */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Título *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
            placeholder="Nombre del curso"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Descripción *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
            placeholder="Descripción del curso"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Tipo de badge</label>
            <select
              value={form.badge_type}
              onChange={(e) => {
                const type = e.target.value as 'free' | 'soon'
                set('badge_type', type)
                set('badge', type === 'free' ? 'Descarga gratuita' : 'Próximamente')
              }}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
            >
              <option value="soon">Próximamente</option>
              <option value="free">Descarga gratuita / Disponible</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Texto del badge</label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) => set('badge', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
              Enlace externo <span className="text-[#86868b] font-normal">(opcional)</span>
            </label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => set('link', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              placeholder="https://drive.google.com/..."
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Texto del botón</label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => set('cta', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              placeholder="Descargar gratis →"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Orden</label>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
              className="w-20 px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
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
            disabled={loading}
            className="bg-[#2F7D6B] text-white font-semibold px-8 py-3 rounded-full text-[15px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
          >
            {loading
              ? 'Guardando...'
              : isEditing
              ? 'Guardar cambios'
              : 'Crear curso y agregar módulos →'}
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

      {/* Módulos — solo en modo edición */}
      {isEditing && (
        <div>
          <div className="border-t border-black/5 pt-8 mb-5">
            <h3 className="text-[18px] font-semibold text-[#0A0A0A] mb-1">Módulos del curso</h3>
            <p className="text-[14px] text-[#6E6E73]">
              Organizá el contenido en módulos. Cada módulo puede tener PDFs, videos o links de YouTube.
            </p>
          </div>
          <ModulesEditor courseId={course.id} />
        </div>
      )}

      {!isEditing && (
        <div className="bg-[#F5F5F7] rounded-2xl px-6 py-5 text-[14px] text-[#6E6E73] flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Una vez creado el curso, vas a poder agregar módulos con PDFs, videos y links de YouTube.
        </div>
      )}
    </div>
  )
}
