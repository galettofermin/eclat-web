'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

export default function AdminFormacion() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('courses').select('*').order('sort_order')
    setCourses(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const togglePublished = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('courses').update({ published: !current }).eq('id', id)
    fetch()
  }

  const remove = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    const supabase = createClient()
    await supabase.from('courses').delete().eq('id', id)
    fetch()
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Formación</h1>
          <p className="text-[15px] text-[#6E6E73]">Gestioná los cursos y materiales</p>
        </div>
        <Link
          href="/admin/formacion/nuevo"
          className="bg-[#2F7D6B] text-white font-semibold px-5 py-2.5 rounded-full text-[14px] hover:bg-[#245f52] transition-colors shrink-0"
        >
          + Nuevo
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
          <p className="text-[16px] text-[#6E6E73] mb-4">No hay cursos todavía.</p>
          <Link href="/admin/formacion/nuevo" className="text-[#2F7D6B] font-semibold hover:underline text-[15px]">
            Agregar el primero →
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-black/5 px-5 py-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    c.badge_type === 'free'
                      ? 'bg-[#DCEFE8] text-[#2F7D6B]'
                      : 'bg-[#F5F5F7] text-[#6E6E73]'
                  }`}>
                    {c.badge}
                  </span>
                </div>
                <p className="text-[15px] font-semibold text-[#0A0A0A] truncate">{c.title}</p>
                <p className="text-[12px] text-[#6E6E73] mt-0.5">Orden: {c.sort_order}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => togglePublished(c.id, c.published)}
                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    c.published
                      ? 'bg-[#DCEFE8] text-[#2F7D6B] hover:bg-[#c8e4d8]'
                      : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#e8e8eb]'
                  }`}
                >
                  {c.published ? 'Publicado' : 'Borrador'}
                </button>
                <Link
                  href={`/admin/formacion/${c.id}`}
                  className="text-[13px] font-medium text-[#2F7D6B] hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => remove(c.id, c.title)}
                  className="text-[13px] font-medium text-red-400 hover:text-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
