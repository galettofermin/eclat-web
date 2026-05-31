'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/lib/types'

export default function AdminServicios() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetch = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setServices(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

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
      fetch()
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#0A0A0A] mb-1">Servicios</h1>
      <p className="text-[15px] text-[#6E6E73] mb-8">Editá los títulos y descripciones de cada servicio</p>

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
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-black/5 p-5">
              {editing?.id === s.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[15px] font-semibold focus:outline-none focus:border-[#2F7D6B] transition-colors"
                  />
                  <textarea
                    rows={3}
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
                  />
                  {error && <p className="text-[13px] text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#2F7D6B] text-white font-semibold px-5 py-2 rounded-full text-[13px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
                    >
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-[13px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
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
          ))}
        </div>
      )}
    </div>
  )
}
