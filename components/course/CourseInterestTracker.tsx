'use client'
import { useEffect } from 'react'

/**
 * Registra silenciosamente que el usuario (logueado) visitó este curso.
 * Si en 24hs no compra, recibirá un mail de seguimiento.
 */
export default function CourseInterestTracker({ courseId }: { courseId: string }) {
  useEffect(() => {
    // Pequeño delay para no bloquear el render inicial
    const t = setTimeout(() => {
      fetch('/api/cursos/interes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      }).catch(() => {}) // silencioso si falla
    }, 3000)
    return () => clearTimeout(t)
  }, [courseId])

  return null
}
