'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CourseModuleWithMaterials, ModuleMaterial } from '@/lib/types'
import ModuleQuizEditor from './ModuleQuizEditor'

const ICON_PDF = (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>)
const ICON_VIDEO = (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>)
const ICON_YT = (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.74 12.52 12.52 0 0 0-7.64 0 4.83 4.83 0 0 1-3.77 2.74A12.22 12.22 0 0 0 2 12a12.22 12.22 0 0 0 2.41 5.31 4.83 4.83 0 0 1 3.77 2.74 12.52 12.52 0 0 0 7.64 0 4.83 4.83 0 0 1 3.77-2.74A12.22 12.22 0 0 0 22 12a12.22 12.22 0 0 0-2.41-5.31zM10 15.5v-7l6 3.5z"/></svg>)

interface AddYouTubeFormProps {
  onAdd: (title: string, url: string) => Promise<void>
  onCancel: () => void
}

function AddYouTubeForm({ onAdd, onCancel }: AddYouTubeFormProps) {
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
    <form onSubmit={handleSubmit} className="bg-[#F5F5F7] rounded-xl p-4 space-y-2 border border-black/5">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del video (opcional)"
        className="w-full px-3 py-2 rounded-lg border border-black/10 text-[13px] focus:outline-none focus:border-[#2F7D6B] bg-white"/>
      <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required
        className="w-full px-3 py-2 rounded-lg border border-black/10 text-[13px] focus:outline-none focus:border-[#2F7D6B] bg-white"/>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="bg-[#2F7D6B] text-white text-[12px] font-semibold px-4 py-2 rounded-full disabled:opacity-60 hover:bg-[#245f52] transition-colors">
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
        <button type="button" onClick={onCancel} className="text-[12px] text-[#6E6E73] hover:text-[#0A0A0A] px-3 py-2">Cancelar</button>
      </div>
    </form>
  )
}

function MaterialItem({ material, onDelete }: { material: ModuleMaterial; onDelete: () => void }) {
  const cfg = { pdf: { icon: ICON_PDF, color: 'bg-red-50 text-red-500' }, video: { icon: ICON_VIDEO, color: 'bg-blue-50 text-blue-500' }, youtube: { icon: ICON_YT, color: 'bg-red-50 text-red-500' } }[material.type]
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white border border-black/5 group">
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[#0A0A0A] truncate">{material.title}</p>
        {material.url && (
          <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#2F7D6B] hover:underline truncate block max-w-xs">
            {material.url}
          </a>
        )}
      </div>
      <button onClick={onDelete} className="shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all" title="Eliminar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}

export default function ModulesEditor({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<CourseModuleWithMaterials[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [addingMaterial, setAddingMaterial] = useState<{ moduleId: string; type: 'youtube' } | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({})
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUpload = useRef<{ moduleId: string; type: 'pdf' | 'video' } | null>(null)

  const load = async () => {
    const supabase = createClient()
    const { data: mods } = await supabase.from('course_modules').select('*').eq('course_id', courseId).order('sort_order')
    if (!mods) { setLoading(false); return }
    const withMaterials = await Promise.all(mods.map(async m => {
      const { data: materials } = await supabase.from('module_materials').select('*').eq('module_id', m.id).order('sort_order')
      return { ...m, subtitle: m.subtitle ?? '', materials: materials ?? [] }
    }))
    setModules(withMaterials)
    setLoading(false)
  }

  useEffect(() => { load() }, [courseId])

  const addModule = async () => {
    if (!newTitle.trim()) return
    const supabase = createClient()
    const { data } = await supabase.from('course_modules')
      .insert({ course_id: courseId, title: newTitle.trim(), subtitle: newSubtitle.trim(), sort_order: modules.length })
      .select().single()
    if (data) {
      setModules(prev => [...prev, { ...data, subtitle: data.subtitle ?? '', materials: [] }])
      setNewTitle(''); setNewSubtitle(''); setAddingModule(false)
      setExpanded(data.id)
    }
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm('¿Eliminar este módulo y todos sus materiales y preguntas?')) return
    const supabase = createClient()
    const mod = modules.find(m => m.id === moduleId)
    const filePaths = mod?.materials.map(m => m.file_path).filter(Boolean) as string[]
    if (filePaths?.length) await supabase.storage.from('course-materials').remove(filePaths)
    await supabase.from('course_modules').delete().eq('id', moduleId)
    setModules(prev => prev.filter(m => m.id !== moduleId))
    if (expanded === moduleId) setExpanded(null)
  }

  const saveModuleEdit = async (moduleId: string) => {
    const supabase = createClient()
    await supabase.from('course_modules').update({ title: editTitle, subtitle: editSubtitle }).eq('id', moduleId)
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title: editTitle, subtitle: editSubtitle } : m))
    setEditingModule(null)
  }

  const addYoutube = async (moduleId: string, title: string, url: string) => {
    const supabase = createClient()
    const sort_order = modules.find(m => m.id === moduleId)?.materials.length ?? 0
    const { data } = await supabase.from('module_materials').insert({ module_id: moduleId, type: 'youtube', title, url, sort_order }).select().single()
    if (data) setModules(prev => prev.map(m => m.id === moduleId ? { ...m, materials: [...m.materials, data] } : m))
    setAddingMaterial(null)
  }

  const triggerUpload = (moduleId: string, type: 'pdf' | 'video') => {
    pendingUpload.current = { moduleId, type }
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'pdf' ? '.pdf' : 'video/*'
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pendingUpload.current) return
    uploadFile(pendingUpload.current.moduleId, file, pendingUpload.current.type)
    e.target.value = ''; pendingUpload.current = null
  }

  const uploadFile = async (moduleId: string, file: File, type: 'pdf' | 'video') => {
    setUploadProgress(p => ({ ...p, [moduleId]: `Subiendo ${file.name}...` }))
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${courseId}/${moduleId}/${Date.now()}.${ext}`
      const { data: upload, error } = await supabase.storage.from('course-materials').upload(path, file)
      if (error) throw error
      const { data: url } = supabase.storage.from('course-materials').getPublicUrl(upload.path)
      const sort_order = modules.find(m => m.id === moduleId)?.materials.length ?? 0
      const { data } = await supabase.from('module_materials').insert({ module_id: moduleId, type, title: file.name.replace(/\.[^/.]+$/, ''), url: url.publicUrl, file_path: upload.path, sort_order }).select().single()
      if (data) setModules(prev => prev.map(m => m.id === moduleId ? { ...m, materials: [...m.materials, data] } : m))
    } catch (err) {
      alert('Error al subir: ' + (err instanceof Error ? err.message : ''))
    } finally {
      setUploadProgress(p => { const n = { ...p }; delete n[moduleId]; return n })
    }
  }

  const deleteMaterial = async (moduleId: string, material: ModuleMaterial) => {
    if (!confirm(`¿Eliminar "${material.title}"?`)) return
    const supabase = createClient()
    if (material.file_path) await supabase.storage.from('course-materials').remove([material.file_path])
    await supabase.from('module_materials').delete().eq('id', material.id)
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, materials: m.materials.filter(mat => mat.id !== material.id) } : m))
  }

  if (loading) return (
    <div className="flex items-center gap-2 py-6 text-[14px] text-[#6E6E73]">
      <div className="w-4 h-4 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin"/>Cargando módulos...
    </div>
  )

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect}/>

      {modules.map((mod, idx) => (
        <div key={mod.id} className="border border-black/[0.08] rounded-2xl overflow-hidden bg-[#FAFAFA]">
          {/* Header del módulo */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-7 h-7 rounded-full bg-[#DCEFE8] text-[#2F7D6B] flex items-center justify-center text-[12px] font-bold shrink-0">
              {idx + 1}
            </div>
            <button onClick={() => setExpanded(expanded === mod.id ? null : mod.id)} className="text-[#6E6E73] hover:text-[#0A0A0A] shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform ${expanded === mod.id ? 'rotate-90' : ''}`}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              {editingModule === mod.id ? (
                <div className="space-y-1.5">
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Título del módulo"
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-black/10 text-[13px] font-semibold focus:outline-none focus:border-[#2F7D6B]"/>
                  <input value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} placeholder="Subtítulo (opcional)"
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-black/10 text-[12px] text-[#6E6E73] focus:outline-none focus:border-[#2F7D6B]"/>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => saveModuleEdit(mod.id)} className="text-[11px] font-semibold text-white bg-[#2F7D6B] px-3 py-1 rounded-full hover:bg-[#245f52]">Guardar</button>
                    <button onClick={() => setEditingModule(null)} className="text-[11px] text-[#6E6E73] px-2 py-1">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[14px] font-semibold text-[#0A0A0A] truncate">{mod.title}</p>
                  {mod.subtitle && <p className="text-[11px] text-[#6E6E73] truncate">{mod.subtitle}</p>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[#86868b]">{mod.materials.length} archivo{mod.materials.length !== 1 ? 's' : ''}</span>
              {editingModule !== mod.id && (
                <button onClick={() => { setEditingModule(mod.id); setEditTitle(mod.title); setEditSubtitle(mod.subtitle ?? '') }}
                  className="text-[11px] text-[#2F7D6B] hover:underline">Editar</button>
              )}
              <button onClick={() => deleteModule(mod.id)} className="text-red-400 hover:text-red-600 transition-colors ml-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido expandido */}
          {expanded === mod.id && (
            <div className="px-4 pb-5 border-t border-black/5 pt-3 space-y-2">
              {/* Materiales */}
              {mod.materials.map(mat => (
                <MaterialItem key={mat.id} material={mat} onDelete={() => deleteMaterial(mod.id, mat)}/>
              ))}

              {/* Upload progress */}
              {uploadProgress[mod.id] && (
                <div className="flex items-center gap-2 text-[12px] text-[#2F7D6B] py-1 px-3 bg-[#DCEFE8] rounded-xl">
                  <div className="w-3 h-3 border border-[#2F7D6B] border-t-transparent rounded-full animate-spin"/>
                  {uploadProgress[mod.id]}
                </div>
              )}

              {/* YouTube form */}
              {addingMaterial?.moduleId === mod.id && (
                <AddYouTubeForm onAdd={(t, u) => addYoutube(mod.id, t, u)} onCancel={() => setAddingMaterial(null)}/>
              )}

              {/* Botones agregar material */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => triggerUpload(mod.id, 'pdf')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors">
                  {ICON_PDF} Subir PDF
                </button>
                <button onClick={() => triggerUpload(mod.id, 'video')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                  {ICON_VIDEO} Subir video
                </button>
                <button onClick={() => setAddingMaterial({ moduleId: mod.id, type: 'youtube' })}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#e8e8eb] px-3 py-1.5 rounded-full transition-colors">
                  {ICON_YT} Link YouTube
                </button>
              </div>

              {/* Quiz editor del módulo */}
              <ModuleQuizEditor moduleId={mod.id}/>
            </div>
          )}
        </div>
      ))}

      {/* Agregar módulo */}
      {addingModule ? (
        <div className="bg-white border-2 border-[#2F7D6B]/30 rounded-2xl px-4 py-3 space-y-2">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título del módulo *" autoFocus
            onKeyDown={e => e.key === 'Escape' && setAddingModule(false)}
            className="w-full text-[14px] font-semibold focus:outline-none bg-transparent text-[#0A0A0A] placeholder-[#86868b]"/>
          <input value={newSubtitle} onChange={e => setNewSubtitle(e.target.value)} placeholder="Subtítulo del módulo (opcional)"
            onKeyDown={e => e.key === 'Enter' && addModule()}
            className="w-full text-[13px] focus:outline-none bg-transparent text-[#6E6E73] placeholder-[#86868b]"/>
          <div className="flex gap-2 pt-1">
            <button onClick={addModule} className="text-[12px] font-semibold text-[#2F7D6B] hover:underline">Crear módulo</button>
            <button onClick={() => { setAddingModule(false); setNewTitle(''); setNewSubtitle('') }} className="text-[12px] text-[#6E6E73]">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAddingModule(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-black/10 rounded-2xl py-3.5 text-[14px] font-medium text-[#6E6E73] hover:border-[#2F7D6B]/40 hover:text-[#2F7D6B] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar módulo
        </button>
      )}
    </div>
  )
}
