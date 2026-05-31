'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BANK_ALIAS, WHATSAPP_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default function InscripcionPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const searchParams = useSearchParams()
  const payoError = searchParams.get('pago') === 'error'
  const router = useRouter()

  const [course, setCourse] = useState<Course | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mpLoading, setMpLoading] = useState(false)
  const [transferSent, setTransferSent] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [tab, setTab] = useState<'mp' | 'transfer'>('mp')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const [{ data: { user } }, { data: courseData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('courses').select('*').eq('id', courseId).single(),
      ])
      if (!user) { router.push(`/login?redirect=/inscripcion/${courseId}`); return }
      if (!courseData) { router.push('/formacion'); return }
      if (courseData.is_free) { router.push(`/cursos/${courseId}`); return }

      // Check existing enrollment
      const { data: enr } = await supabase
        .from('enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      if (enr) { router.push(`/cursos/${courseId}`); return }

      setUser({ id: user.id, email: user.email ?? '' })
      setCourse(courseData)
      setLoading(false)
    }
    init()
  }, [courseId, router])

  const handleMP = async () => {
    if (!user || !course) return
    setMpLoading(true)
    try {
      const res = await fetch('/api/mp/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, userId: user.id, userEmail: user.email }),
      })
      const { init_point, error } = await res.json()
      if (error || !init_point) throw new Error(error ?? 'Sin init_point')
      window.location.href = init_point
    } catch {
      setMpLoading(false)
      alert('Error al conectar con Mercado Pago. Intentá de nuevo.')
    }
  }

  const handleTransfer = async () => {
    if (!user || !course) return
    setTransferLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: course.id,
      status: 'pending',
      payment_method: 'transfer',
      amount: course.price,
      user_email: user.email,
    })
    if (!error) setTransferSent(true)
    setTransferLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) return null

  if (transferSent) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#DCEFE8] flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-[24px] font-semibold text-[#0A0A0A] mb-3">¡Listo! Registramos tu transferencia</h1>
          <p className="text-[16px] text-[#6E6E73] mb-8 leading-relaxed">
            Una vez que confirmemos el pago, tu acceso al curso se activará automáticamente. Suele tardar hasta 24 hs hábiles.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-[#245f52] transition-colors mb-4"
          >
            Avisarnos por WhatsApp
          </a>
          <p className="text-[13px] text-[#6E6E73]">Podés enviarnos el comprobante para agilizar la confirmación.</p>
          <Link href="/mis-cursos" className="block mt-6 text-[14px] text-[#2F7D6B] hover:underline font-medium">
            Ver mis cursos →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href={`/cursos/${course.id}`} className="text-[13px] text-[#6E6E73] hover:text-[#2F7D6B] transition-colors">
            ← Volver al curso
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
          {/* Course summary */}
          <div className="px-7 py-6 border-b border-black/5 bg-[#F5F5F7]/50">
            <p className="text-[13px] text-[#6E6E73] mb-1">Estás comprando</p>
            <p className="text-[17px] font-semibold text-[#0A0A0A]">{course.title}</p>
            <p className="text-[26px] font-bold text-[#0A0A0A] mt-2">{formatPrice(course.price)}</p>
          </div>

          {/* Error banner */}
          {payoError && (
            <div className="mx-7 mt-5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl">
              El pago no se completó. Podés intentarlo de nuevo.
            </div>
          )}

          {/* Tabs */}
          <div className="px-7 pt-6">
            <div className="flex gap-2 mb-6 bg-[#F5F5F7] p-1 rounded-xl">
              <button
                onClick={() => setTab('mp')}
                className={`flex-1 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${tab === 'mp' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#6E6E73] hover:text-[#0A0A0A]'}`}
              >
                Mercado Pago
              </button>
              <button
                onClick={() => setTab('transfer')}
                className={`flex-1 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${tab === 'transfer' ? 'bg-white text-[#0A0A0A] shadow-sm' : 'text-[#6E6E73] hover:text-[#0A0A0A]'}`}
              >
                Transferencia
              </button>
            </div>

            {tab === 'mp' && (
              <div className="pb-7">
                <p className="text-[14px] text-[#6E6E73] mb-5 leading-relaxed">
                  Pagá con tarjeta de crédito, débito o dinero en cuenta de Mercado Pago. El acceso se activa automáticamente.
                </p>
                <button
                  onClick={handleMP}
                  disabled={mpLoading}
                  className="w-full py-4 bg-[#009EE3] text-white font-bold text-[16px] rounded-xl hover:bg-[#0088cc] disabled:opacity-60 transition-colors flex items-center justify-center gap-3"
                >
                  {mpLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="22" height="22" viewBox="0 0 40 40" fill="white">
                        <path d="M20 4C11.16 4 4 11.16 4 20s7.16 16 16 16 16-7.16 16-16S28.84 4 20 4zm-1.5 22.5h-3v-9h3v9zm-1.5-10.5c-1 0-1.5-.67-1.5-1.5s.5-1.5 1.5-1.5 1.5.67 1.5 1.5-.5 1.5-1.5 1.5zm9 10.5h-3V20c0-1.1-.4-1.5-1.5-1.5s-1.5.4-1.5 1.5v6.5h-3v-9h3v1.5c.5-.9 1.4-1.5 2.5-1.5 2 0 3.5 1.3 3.5 3.5v5.5z" />
                      </svg>
                      Pagar con Mercado Pago
                    </>
                  )}
                </button>
                <p className="text-[12px] text-[#86868b] text-center mt-3">
                  Serás redirigido a Mercado Pago de forma segura
                </p>
              </div>
            )}

            {tab === 'transfer' && (
              <div className="pb-7">
                <p className="text-[14px] text-[#6E6E73] mb-5 leading-relaxed">
                  Realizá una transferencia bancaria y avisanos por WhatsApp con el comprobante. Activamos tu acceso en hasta 24 hs hábiles.
                </p>

                <div className="bg-[#F5F5F7] rounded-xl p-5 mb-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6E6E73]">Alias</span>
                    <span className="text-[14px] font-bold text-[#0A0A0A] tracking-wide">{BANK_ALIAS}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-black/5 pt-3">
                    <span className="text-[13px] text-[#6E6E73]">Monto</span>
                    <span className="text-[17px] font-bold text-[#0A0A0A]">{formatPrice(course.price)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-black/5 pt-3">
                    <span className="text-[13px] text-[#6E6E73]">Titular</span>
                    <span className="text-[14px] font-medium text-[#0A0A0A]">Centro ÉCLAT</span>
                  </div>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={transferLoading}
                  className="w-full py-4 bg-[#2F7D6B] text-white font-bold text-[16px] rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors"
                >
                  {transferLoading ? 'Registrando...' : 'Ya transferí, registrar pago'}
                </button>
                <p className="text-[12px] text-[#86868b] text-center mt-3">
                  El acceso se activa una vez confirmado el pago
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
