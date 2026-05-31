'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CourseModuleWithMaterials, ModuleMaterial } from '@/lib/types'

const ICON_PDF = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
const ICON_VIDEO = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
)
const ICON_YT = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.74 12.52 12.52 0 0 0-7.64 0 4.83 4.83 0 0 1-3.77 2.74A12.22 12.22 0 0 0 2 12a12.22 12.22 0 0 0 2.41 5.31 4.83 4.83 0 0 1 3.77 2.74 12.52 12.52 0 0 0 7.64 0 4.83 4.83 0 0 1 3.77-2.74A12.22 12.22 0 0 0 22 12a12.22 12.22 0 0 0-2.41-5.31zM10 15.5v-7l6 3.5z" />
  </svg>
)

interface AddYoutubeFormProps {
  onAdd: (title: string, url: string) => Promise<void>
  onCancel: () => void
}

function AddYoutubeForm({ onAdd, onCancel }: AddYoutubeFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    await onAdd(title || 'Video de YouTube', url.trim())
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F5F7] rounded-xl p-4 space-y-3 border border-black/5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del video (opcional)"
        className="w-full px-3 py-2 rounded-lg border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] bg-white"
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        required
        className="w-full px-3 py-2 rounded-lg border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] bg-white"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-[#2F7D6B] text-white text-[13px] font-semibold px-4 py-2 rounded-full disabled:opacity-60 hover:bg-[#245f52] transition-colors">
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] text-[#6E6E73] hover:text-[#0A0A0A] transition-colors px-2">
          Cancelar
        </button>
      </div>
    </form>
  )
}

interface MaterialItemProps {
  material: ModuleMaterial
  onDelete: () => void
}

function MaterialItem({ material, onDelete }: MaterialItemProps) {
  const typeConfig = {
    pdf:     { icon: ICON_PDF, label: 'PDF', color: 'text-red-500 bg-red-50' },
    video:   { icon: ICON_VIDEO, label: 'Video', color: 'text-blue-500 bg-blue-50' },
    youtube: { icon: ICON_YT, label: 'YouTube', color: 'text-red-500 bg-red-50' },
  }[material.type]

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white border border-black/5 group">
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeConfig.color}`}>
        {typeConfig.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#0A0A0A] truncate">{material.title}</p>
        {material.url && (
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#2F7D6B] hover:underline truncate block max-w-xs"
          >
            {material.url}
          </a>
        )}
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
        title="Eliminar"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

export default function ModulesEditor({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<CourseModuleWithMaterials[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [addingMaterial, setAddingMaterial] = useState<{ moduleId: string; type: 'youtube' } | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUpload = useRef<{ moduleId: string; type: 'pdf' | 'video' } | null>(null)

  const loadModules = async () => {
    const supabase = createClient()
    const { data: modulesData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order')

    if (!modulesData) { setLoading(false); return }

    const withMaterials = await Promise.all(
      modulesData.map(async (m) => {
        const { data: materials } = await supabase
          .from('module_materials')
          .select('*')
          .eq('module_id', m.id)
          .order('sort_order')
        return { ...m, materials: materials ?? [] }
      })
    )
    setModules(withMaterials)
    setLoading(false)
  }

  useEffect(() => { loadModules() }, [courseId])

  const addModule = async () => {
    if (!newModuleTitle.trim()) return
    const supabase = createClient()
    const { data } = await supabase
      .from('course_modules')
      .insert({ course_id: courseId, title: newModuleTitle.trim(), sort_order: modules.length })
      .select()
      .single()
    if (data) {
      const newMod = { ...data, materials: [] }
      setModules((prev) => [...prev, newMod])
      setNewModuleTitle('')
      setAddingModule(false)
      setExpanded(data.id)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm('¿Eliminar este módulo y todos sus materiales?')) return
    const supabase = createClient()
    // Delete associated files from storage
    const mod = modules.find((m) => m.id === moduleId)
    const filePaths = mod?.materials.map((mat) => mat.file_path).filter(Boolean) as string[]
    if (filePaths.length) await supabase.storage.from('course-materials').remove(filePaths)
    await supabase.from('course_modules').delete().eq('id', moduleId)
    setModules((prev) => prev.filter((m) => m.id !== moduleId))
    if (expanded === moduleId) setExpanded(null)
  }

  const updateModuleTitle = async (moduleId: string, title: string) => {
    const supabase = createClient()
    await supabase.from('course_modules').update({ title }).eq('id', moduleId)
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, title } : m))
  }

  const addYoutube = async (moduleId: string, title: string, url: string) => {
    const supabase = createClient()
    const sort_order = modules.find((m) => m.id === moduleId)?.materials.length ?? 0
    const { data } = await supabase
      .from('module_materials')
      .insert({ module_id: moduleId, type: 'youtube', title, url, sort_order })
      .select()
      .single()
    if (data) {
      setModules((prev) => prev.map((m) =>
        m.id === moduleId ? { ...m, materials: [...m.materials, data] } : m
      ))
    }
    setAddingMaterial(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pendingUpload.current) return
    const { moduleId, type } = pendingUpload.current
    uploadFile(moduleId, file, type)
    e.target.value = ''
    pendingUpload.current = null
  }

  const triggerUpload = (moduleId: string, type: 'pdf' | 'video') => {
    pendingUpload.current = { moduleId, type }
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'pdf' ? '.pdf' : 'video/*'
      fileInputRef.current.click()
    }
  }

  const uploadFile = async (moduleId: string, file: File, type: 'pdf' | 'video') => {
    setUploadProgress((p) => ({ ...p, [moduleId]: `Subiendo ${file.name}...` }))
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${courseId}/${moduleId}/${Date.now()}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(path, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(uploadData.path)

      const sort_order = modules.find((m) => m.id === moduleId)?.materials.length ?? 0
      const { data } = await supabase
        .from('module_materials')
        .insert({
          module_id: moduleId,
          type,
          title: file.name.replace(/\.[^/.]+$/, ''),
          url: urlData.publicUrl,
          file_path: uploadData.path,
          sort_order,
        })
        .select()
        .single()

      if (data) {
        setModules((prev) => prev.map((m) =>
          m.id === moduleId ? { ...m, materials: [...m.materials, data] } : m
        ))
      }
    } catch (err) {
      alert(`Error al subir: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setUploadProgress((p) => { const n = { ...p }; delete n[moduleId]; return n })
    }
  }

  const deleteMaterial = async (moduleId: string, material: ModuleMaterial) => {
    if (!confirm(`¿Eliminar "${material.title}"?`)) return
    const supabase = createClient()
    if (material.file_path) {
      await supabase.storage.from('course-materials').remove([material.file_path])
    }
    await supabase.from('module_materials').delete().eq('id', material.id)
    setModules((prev) => prev.map((m) =>
      m.id === moduleId ? { ...m, materials: m.materials.filter((mat) => mat.id !== material.id) } : m
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-[14px] text-[#6E6E73]">
        <div className="w-4 h-4 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        Cargando módulos...
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />

      {/* Module list */}
      {modules.map((mod) => (
        <div key={mod.id} className="border border-black/[0.08] rounded-2xl overflow-hidden bg-[#FAFAFA]">
          {/* Module header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
              className="text-[#6E6E73] hover:text-[#0A0A0A] transition-colors"
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform ${expanded === mod.id ? 'rotate-90' : ''}`}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <input
              type="text"
              value={mod.title}
              onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
              onBlur={(e) => updateModuleTitle(mod.id, e.target.value)}
              className="flex-1 bg-transparent text-[14px] font-semibold text-[#0A0A0A] focus:outline-none focus:bg-white focus:px-2 focus:rounded-lg transition-all"
            />
            <span className="text-[12px] text-[#86868b] shrink-0">
              {mod.materials.length} material{mod.materials.length !== 1 ? 'es' : ''}
            </span>
            <button
              onClick={() => deleteModule(mod.id)}
              className="text-red-400 hover:text-red-600 transition-colors shrink-0"
              title="Eliminar módulo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>

          {/* Expanded content */}
          {expanded === mod.id && (
            <div className="px-4 pb-4 border-t border-black/5 pt-3 space-y-2">
              {/* Materials */}
              {mod.materials.map((mat) => (
                <MaterialItem
                  key={mat.id}
                  material={mat}
                  onDelete={() => deleteMaterial(mod.id, mat)}
                />
              ))}

              {/* Upload progress */}
              {uploadProgress[mod.id] && (
                <div className="flex items-center gap-2 text-[13px] text-[#2F7D6B] py-1 px-3 bg-[#DCEFE8] rounded-xl">
                  <div className="w-3 h-3 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
                  {uploadProgress[mod.id]}
                </div>
              )}

              {/* Add YouTube form */}
              {addingMaterial?.moduleId === mod.id && addingMaterial.type === 'youtube' && (
                <AddYoutubeForm
                  onAdd={(title, url) => addYoutube(mod.id, title, url)}
                  onCancel={() => setAddingMaterial(null)}
                />
              )}

              {/* Add material buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => triggerUpload(mod.id, 'pdf')}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {ICON_PDF}
                  Subir PDF
                </button>
                <button
                  onClick={() => triggerUpload(mod.id, 'video')}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {ICON_VIDEO}
                  Subir video
                </button>
                <button
                  onClick={() => setAddingMaterial({ moduleId: mod.id, type: 'youtube' })}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#e8e8eb] px-3 py-1.5 rounded-full transition-colors"
                >
                  {ICON_YT}
                  Link YouTube
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add module */}
      {addingModule ? (
        <div className="flex items-center gap-3 bg-white border border-[#2F7D6B]/30 rounded-2xl px-4 py-3">
          <input
            type="text"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addModule(); if (e.key === 'Escape') setAddingModule(false) }}
            autoFocus
            placeholder="Nombre del módulo..."
            className="flex-1 text-[14px] focus:outline-none bg-transparent"
          />
          <button onClick={addModule} className="text-[13px] font-semibold text-[#2F7D6B] hover:underline">
            Agregar
          </button>
          <button onClick={() => { setAddingModule(false); setNewModuleTitle('') }} className="text-[13px] text-[#6E6E73]">
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingModule(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-black/10 rounded-2xl py-3 text-[14px] font-medium text-[#6E6E73] hover:border-[#2F7D6B]/40 hover:text-[#2F7D6B] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar módulo
        </button>
      )}
    </div>
  )
}
