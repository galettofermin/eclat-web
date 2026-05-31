'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export interface EditField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image' | 'select' | 'number'
  value: string
  rows?: number
  hint?: string
  options?: string[]
}

interface EditDrawerProps {
  isOpen: boolean
  title: string
  fields: EditField[]
  onSave: (data: Record<string, string>) => Promise<void>
  onClose: () => void
  onDelete?: () => Promise<void>
  deleteLabel?: string
}

export default function EditDrawer({
  isOpen, title, fields, onSave, onClose, onDelete, deleteLabel
}: EditDrawerProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.key, f.value]))
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const router = useRouter()

  // Reset values when fields change (opening different item)
  useState(() => {
    setValues(Object.fromEntries(fields.map(f => [f.key, f.value])))
  })

  const set = (key: string, value: string) =>
    setValues(v => ({ ...v, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await onSave(values)
      router.refresh()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!confirm(`¿${deleteLabel ?? 'Eliminar este elemento'}? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    try {
      await onDelete()
      router.refresh()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
      setDeleting(false)
    }
  }

  const uploadImage = async (key: string, file: File) => {
    setUploadingKey(key)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${key}-${Date.now()}.${ext}`
      const { data, error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(data.path)
      set(key, urlData.publicUrl)
    } catch (e) {
      setError('Error al subir imagen: ' + (e instanceof Error ? e.message : ''))
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[61] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2F7D6B]" />
                <h2 className="text-[16px] font-semibold text-[#0A0A0A]">{title}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center hover:bg-[#E8E8E8] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                    {field.label}
                  </label>
                  {field.hint && <p className="text-[11px] text-[#86868b] mb-1.5">{field.hint}</p>}

                  {field.type === 'image' ? (
                    <div className="space-y-2">
                      {values[field.key] && (
                        <img src={values[field.key]} alt="preview" className="w-full h-32 object-cover rounded-xl border border-black/10" />
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileRefs.current[field.key]?.click()}
                          disabled={uploadingKey === field.key}
                          className="flex-1 py-2.5 border-2 border-dashed border-[#2F7D6B]/40 rounded-xl text-[13px] font-medium text-[#2F7D6B] hover:border-[#2F7D6B] hover:bg-[#DCEFE8]/30 transition-colors disabled:opacity-60"
                        >
                          {uploadingKey === field.key ? 'Subiendo...' : '+ Subir imagen'}
                        </button>
                        <input
                          ref={el => { fileRefs.current[field.key] = el }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(field.key, f); e.target.value = '' }}
                        />
                      </div>
                      {values[field.key] && (
                        <input
                          type="url"
                          value={values[field.key]}
                          onChange={e => set(field.key, e.target.value)}
                          placeholder="O pegá una URL de imagen"
                          className="w-full px-3 py-2 rounded-xl border border-black/10 text-[12px] focus:outline-none focus:border-[#2F7D6B] transition-colors text-[#6E6E73]"
                        />
                      )}
                      {!values[field.key] && (
                        <input
                          type="url"
                          value={values[field.key]}
                          onChange={e => set(field.key, e.target.value)}
                          placeholder="O pegá una URL de imagen"
                          className="w-full px-3 py-2 rounded-xl border border-black/10 text-[12px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                        />
                      )}
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      value={values[field.key]}
                      onChange={e => set(field.key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
                    >
                      {field.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key]}
                      onChange={e => set(field.key, e.target.value)}
                      rows={field.rows ?? 4}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={values[field.key]}
                      onChange={e => set(field.key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                    />
                  )}
                </div>
              ))}

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] text-red-500">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-black/[0.06] space-y-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl text-[15px] hover:bg-[#245f52] disabled:opacity-60 transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-2.5 text-red-500 font-medium rounded-xl text-[14px] hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  {deleting ? 'Eliminando...' : `🗑 ${deleteLabel ?? 'Eliminar'}`}
                </button>
              )}
              <button onClick={onClose} className="w-full py-2.5 text-[#6E6E73] font-medium rounded-xl text-[14px] hover:bg-[#F5F5F7] transition-colors">
                Cancelar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
