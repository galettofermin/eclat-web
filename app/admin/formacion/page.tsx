'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

/* ─── Modal envío de email de curso ─── */
function CourseEmailModal({
  course,
  onClose,
}: {
  course: Course
  onClose: () => void
}) {
  const [asunto, setAsunto] = useState(`Nueva formación disponible: ${course.title}`)
  const [introExtra, setIntroExtra] = useState('')
  const [emailsExtra, setEmailsExtra] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; enviados?: number; errores?: number; extrasAgregados?: number; error?: string } | null>(null)

  const handleSend = async () => {
    setSending(true)
    setResult(null)
    try {
      const extras = emailsExtra
        .split(/[\n,;]+/)
        .map(e => e.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/formacion/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          asunto: asunto.trim(),
          introExtra: introExtra.trim(),
          emailsExtra: extras,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ ok: false, error: 'Error de red' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[17px] font-semibold text-[#0A0A0A]">Enviar propuesta por email</h2>
              <p className="text-[13px] text-[#6E6E73] mt-0.5 truncate max-w-xs">{course.title}</p>
            </div>
            <button onClick={onClose} className="text-[#86868b] hover:text-[#1d1d1f] transition-colors mt-0.5 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {!result ? (
          <div className="px-6 py-5 space-y-4">
            {/* Asunto */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-1.5">Asunto</label>
              <input
                type="text"
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              />
            </div>

            {/* Intro extra */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-1.5">
                Mensaje introductorio <span className="font-normal normal-case">(opcional)</span>
              </label>
              <textarea
                value={introExtra}
                onChange={e => setIntroExtra(e.target.value)}
                rows={3}
                placeholder="Podés agregar un mensaje personal antes del contenido del curso..."
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
              />
            </div>

            {/* Emails extra */}
            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-1.5">
                Emails extra a agregar a la comunidad <span className="font-normal normal-case">(opcional)</span>
              </label>
              <textarea
                value={emailsExtra}
                onChange={e => setEmailsExtra(e.target.value)}
                rows={2}
                placeholder="uno@mail.com, otro@mail.com"
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none"
              />
              <p className="text-[11px] text-[#86868b] mt-1.5">
                Separados por coma, punto y coma o salto de línea. Quedan suscritos a la comunidad y reciben el email.
              </p>
            </div>

            {/* Info */}
            <div className="bg-[#EDF3F0] rounded-xl px-4 py-3 flex gap-2.5">
              <span className="text-[#2F7D6B] mt-0.5">📨</span>
              <p className="text-[13px] text-[#4F7566] leading-relaxed">
                Se enviará a <strong>todos los suscriptores activos</strong> de la comunidad, más los emails que agregues arriba.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-black/10 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !asunto.trim()}
                className="flex-1 py-3 rounded-xl bg-[#2F7D6B] text-white text-[14px] font-semibold hover:bg-[#245f52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar ahora'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Resultado */
          <div className="px-6 py-8 text-center space-y-4">
            {result.ok ? (
              <>
                <div className="w-14 h-14 rounded-full bg-[#DCEFE8] flex items-center justify-center mx-auto text-2xl">✓</div>
                <div>
                  <p className="text-[17px] font-semibold text-[#0A0A0A]">¡Email enviado!</p>
                  <p className="text-[14px] text-[#6E6E73] mt-1">
                    {result.enviados} enviado{result.enviados !== 1 ? 's' : ''}
                    {result.errores ? ` · ${result.errores} con error` : ''}
                    {result.extrasAgregados ? ` · ${result.extrasAgregados} nuevo${result.extrasAgregados !== 1 ? 's' : ''} en la comunidad` : ''}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-2xl">✗</div>
                <div>
                  <p className="text-[17px] font-semibold text-[#0A0A0A]">Hubo un problema</p>
                  <p className="text-[13px] text-[#6E6E73] mt-1">{result.error || 'Error desconocido'}</p>
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-[#2F7D6B] text-white text-[14px] font-semibold hover:bg-[#245f52] transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Página principal ─── */
export default function AdminFormacion() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [emailCourse, setEmailCourse] = useState<Course | null>(null)

  const fetchCourses = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('courses').select('*').order('sort_order')
    setCourses(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const togglePublished = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('courses').update({ published: !current }).eq('id', id)
    fetchCourses()
  }

  const remove = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    const supabase = createClient()
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  return (
    <div>
      {emailCourse && (
        <CourseEmailModal
          course={emailCourse}
          onClose={() => setEmailCourse(null)}
        />
      )}

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
                {/* Botón enviar email */}
                <button
                  onClick={() => setEmailCourse(c)}
                  title="Enviar propuesta a la comunidad"
                  className="text-[12px] font-medium text-[#4F7566] hover:text-[#2F7D6B] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#4F7566]/20 hover:border-[#2F7D6B]/40 hover:bg-[#EDF3F0]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span className="hidden sm:inline">Enviar</span>
                </button>

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
