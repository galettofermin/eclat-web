'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ModuleCompleteBtnProps {
  moduleId: string
  courseId: string
  userId: string
}

export default function ModuleCompleteBtn({ moduleId, courseId, userId }: ModuleCompleteBtnProps) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('module_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .maybeSingle()
      setCompleted(!!data)
      setLoading(false)
    }
    check()
  }, [moduleId, userId])

  const toggle = async () => {
    setSaving(true)
    const supabase = createClient()
    if (completed) {
      await supabase.from('module_progress').delete()
        .eq('user_id', userId).eq('module_id', moduleId)
      setCompleted(false)
    } else {
      await supabase.from('module_progress').upsert({
        user_id: userId, module_id: moduleId, course_id: courseId
      })
      setCompleted(true)
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full transition-all ${
        completed
          ? 'bg-[#DCEFE8] text-[#2F7D6B] hover:bg-[#c8e4d8]'
          : 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#DCEFE8] hover:text-[#2F7D6B] border border-black/[0.06]'
      }`}
    >
      {saving ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : completed ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )}
      {completed ? 'Completado' : 'Marcar como completado'}
    </button>
  )
}
