'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Enrollment {
  id: string
  status: string
  payment_method: string
  amount: number
  user_email: string
  created_at: string
  approved_at: string | null
  courses: { title: string } | null
}

export default function AdminInscripciones() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

  const fetch = async () => {
    const supabase = createClient()
    let query = supabase
      .from('enrollments')
      .select('*, courses(title)')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setEnrollments((data as Enrollment[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { setLoading(true); fetch() }, [filter])

  const approve = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from('enrollments')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id)
    fetch()
  }

  const reject = async (id: string) => {
    if (!confirm('¿Rechazar esta inscripción?')) return
    const supabase = createClient()
    await supabase.from('enrollments').update({ status: 'rejected' }).eq('id', id)
    fetch()
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#0A0A0A] mb-1">Inscripciones</h1>
      <p className="text-[15px] text-[#6E6E73] mb-8">Gestioná los pagos y accesos a los cursos</p>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              filter === f
                ? 'bg-[#2F7D6B] text-white'
                : 'bg-white border border-black/10 text-[#424245] hover:border-[#2F7D6B]/40'
            }`}
          >
            {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
          <p className="text-[16px] text-[#6E6E73]">
            {filter === 'pending' ? 'No hay inscripciones pendientes.' : 'No hay inscripciones.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enr) => (
            <div key={enr.id} className="bg-white rounded-2xl border border-black/5 px-5 py-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#0A0A0A] truncate">
                  {enr.courses?.title ?? 'Curso desconocido'}
                </p>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">{enr.user_email}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${
                    enr.payment_method === 'mercadopago'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-[#F5F5F7] text-[#6E6E73]'
                  }`}>
                    {enr.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}
                  </span>
                  <span className="text-[12px] text-[#86868b]">{formatDate(enr.created_at)}</span>
                  <span className="text-[12px] font-semibold text-[#0A0A0A]">{formatPrice(enr.amount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {enr.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approve(enr.id)}
                      className="bg-[#DCEFE8] text-[#2F7D6B] font-semibold text-[13px] px-4 py-2 rounded-full hover:bg-[#c8e4d8] transition-colors"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => reject(enr.id)}
                      className="text-red-400 hover:text-red-600 font-semibold text-[13px] transition-colors"
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {enr.status === 'approved' && (
                  <span className="text-[12px] font-semibold text-[#2F7D6B] bg-[#DCEFE8] px-3 py-1.5 rounded-full">
                    ✓ Aprobado
                  </span>
                )}
                {enr.status === 'rejected' && (
                  <span className="text-[12px] font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full">
                    Rechazado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
