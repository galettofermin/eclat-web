import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LOGO_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function MisCursosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/mis-cursos')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const name = user.user_metadata?.full_name ?? user.email

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[#DCEFE8] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-[24px] font-semibold text-[#0A0A0A]">Mis cursos</h1>
            <p className="text-[14px] text-[#6E6E73]">{name}</p>
          </div>
        </div>

        {/* Enrollments */}
        {!enrollments?.length ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p className="text-[17px] font-semibold text-[#0A0A0A] mb-2">Todavía no tenés cursos</p>
            <p className="text-[14px] text-[#6E6E73] mb-6">Explorá la oferta formativa de ÉCLAT</p>
            <Link href="/formacion" className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-[#245f52] transition-colors">
              Ver cursos disponibles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enr) => {
              const course = enr.courses as { id: string; title: string; description: string } | null
              if (!course) return null
              return (
                <div key={enr.id} className="bg-white rounded-2xl border border-black/5 p-6 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#DCEFE8] flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold text-[#0A0A0A] truncate">{course.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {enr.status === 'approved' ? (
                        <span className="text-[12px] font-semibold text-[#2F7D6B] bg-[#DCEFE8] px-2.5 py-0.5 rounded-full">Acceso activo</span>
                      ) : enr.status === 'pending' ? (
                        <span className="text-[12px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">Pago en verificación</span>
                      ) : (
                        <span className="text-[12px] font-semibold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full">Rechazado</span>
                      )}
                    </div>
                  </div>
                  {enr.status === 'approved' && (
                    <Link
                      href={`/cursos/${course.id}`}
                      className="shrink-0 text-[13px] font-semibold text-[#2F7D6B] hover:underline"
                    >
                      Ir al curso →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
