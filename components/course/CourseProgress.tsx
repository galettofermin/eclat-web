'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CourseProgressProps {
  courseId: string
  userId: string
  totalModules: number
  moduleIds: string[]
}

export default function CourseProgress({ courseId, userId, totalModules, moduleIds }: CourseProgressProps) {
  const [completed, setCompleted] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || totalModules === 0) { setLoading(false); return }

    const supabase = createClient()

    const fetchProgress = async () => {
      const { count } = await supabase
        .from('module_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .in('module_id', moduleIds)
      setCompleted(count ?? 0)
      setLoading(false)
    }

    fetchProgress()

    // Suscripción en tiempo real — se actualiza al tocar "Completado"
    const channel = supabase
      .channel(`progress-${courseId}-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'module_progress',
        filter: `user_id=eq.${userId}`,
      }, () => fetchProgress())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [courseId, userId, totalModules, moduleIds])

  if (loading || totalModules === 0) return null

  const pct = Math.round((completed / totalModules) * 100)
  const allDone = completed >= totalModules

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 16,
      padding: '16px 20px',
      marginBottom: 24,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {allDone ? (
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#2F7D6B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          ) : (
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#DCEFE8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </span>
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2B26' }}>
            {allDone ? '¡Curso completado!' : 'Tu progreso'}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: allDone ? '#2F7D6B' : '#6E6E73' }}>
          {completed} / {totalModules} módulos
        </span>
      </div>

      {/* Barra */}
      <div style={{
        width: '100%', height: 6, borderRadius: 99,
        background: '#F0F0F0',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 99,
          background: allDone
            ? 'linear-gradient(90deg, #2F7D6B, #3da88f)'
            : 'linear-gradient(90deg, #2F7D6B, #4caf96)',
          transition: 'width .4s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>

      {allDone && (
        <p style={{ fontSize: 12, color: '#2F7D6B', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>
          🎉 Terminaste todos los módulos del curso
        </p>
      )}
    </div>
  )
}
