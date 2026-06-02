'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const SECTIONS = [
  {
    title: 'Inicio — Hero',
    fields: [
      { key: 'hero_subtitle', label: 'Subtítulo del hero', rows: 3, hint: 'Texto descriptivo debajo del slogan principal' },
      { key: 'hero_team_image', label: 'Foto del equipo (URL)', rows: 1, hint: 'URL de la imagen. Subila a Supabase Storage o usá cualquier URL pública.' },
    ],
  },
  {
    title: 'Sobre ÉCLAT',
    fields: [
      { key: 'about_title', label: 'Título de la sección', rows: 1, hint: '' },
      { key: 'about_body', label: 'Texto de habilitación/registro', rows: 3, hint: 'Ministerio, Superintendencia, etc.' },
      { key: 'about_mision', label: 'Columna — Misión', rows: 3, hint: '' },
      { key: 'about_valores', label: 'Columna — Valores', rows: 3, hint: '' },
      { key: 'about_enfoque', label: 'Columna — Enfoque', rows: 3, hint: '' },
      { key: 'about_quote', label: 'Cita destacada', rows: 2, hint: '' },
    ],
  },
  {
    title: 'Servicios',
    fields: [
      { key: 'services_title', label: 'Título de la sección', rows: 1, hint: 'Ej: "Lo que hacemos."' },
      { key: 'services_subtitle', label: 'Subtítulo', rows: 2, hint: '' },
    ],
  },
  {
    title: 'Formación',
    fields: [
      { key: 'formation_title', label: 'Título de la sección', rows: 1, hint: 'Ej: "Cursos y materiales."' },
      { key: 'formation_subtitle', label: 'Subtítulo', rows: 2, hint: '' },
      { key: 'formation_cta_title', label: 'Título del bloque verde (CTA)', rows: 1, hint: '' },
      { key: 'formation_cta_subtitle', label: 'Subtítulo del bloque verde', rows: 2, hint: '' },
    ],
  },
  {
    title: 'Escritos',
    fields: [
      { key: 'escritos_title', label: 'Título de la sección', rows: 1, hint: 'Ej: "Ideas que cuidan."' },
      { key: 'escritos_subtitle', label: 'Subtítulo', rows: 2, hint: '' },
      { key: 'newsletter_title', label: 'Título del newsletter', rows: 1, hint: '' },
      { key: 'newsletter_subtitle', label: 'Subtítulo del newsletter', rows: 2, hint: '' },
    ],
  },
  {
    title: 'Página de Turnos',
    fields: [
      { key: 'turnos_title', label: 'Título', rows: 1, hint: '' },
      { key: 'turnos_subtitle', label: 'Texto descriptivo', rows: 2, hint: '' },
    ],
  },
]

export default function AdminConfiguracion() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchConfig = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('site_config').select('*')
      const map: Record<string, string> = {}
      data?.forEach((row) => { map[row.key] = row.value })
      setConfig(map)
      setLoading(false)
    }
    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const supabase = createClient()
    const entries = Object.entries(config).filter(([, v]) => v !== undefined)
    const results = await Promise.all(
      entries.map(([key, value]) =>
        supabase.from('site_config').upsert({ key, value, updated_at: new Date().toISOString() })
      )
    )
    const err = results.find((r) => r.error)
    if (err?.error) {
      setError(err.error.message)
    } else {
      setSuccess('Configuración guardada correctamente.')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  const set = (key: string, value: string) =>
    setConfig((c) => ({ ...c, [key]: value }))

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#0A0A0A] mb-1">Configuración del sitio</h1>
      <p className="text-[15px] text-[#6E6E73] mb-8">
        Editá todos los textos visibles en el sitio público. Los cambios se reflejan al guardar.
      </p>

      {success && (
        <div className="mb-6 px-4 py-3 bg-[#DCEFE8] text-[#2F7D6B] rounded-xl text-[14px] font-medium border border-[#2F7D6B]/20 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-black/5 overflow-hidden">
              <div className="px-7 py-4 border-b border-black/5 bg-[#F5F5F7]/50">
                <h2 className="text-[15px] font-semibold text-[#0A0A0A]">{section.title}</h2>
              </div>
              <div className="p-7 space-y-5">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                      {field.label}
                    </label>
                    {field.hint && (
                      <p className="text-[12px] text-[#86868b] mb-1.5">{field.hint}</p>
                    )}
                    {field.rows === 1 ? (
                      <input
                        type="text"
                        value={config[field.key] ?? ''}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                      />
                    ) : (
                      <textarea
                        rows={field.rows}
                        value={config[field.key] ?? ''}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
          )}

          <div className="sticky bottom-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-[#2F7D6B] text-white font-semibold px-10 py-3.5 rounded-full text-[15px] hover:bg-[#245f52] disabled:opacity-60 transition-colors shadow-lg shadow-[#2F7D6B]/25"
            >
              {saving ? 'Guardando...' : 'Guardar toda la configuración'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
