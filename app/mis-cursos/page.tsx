import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function MisCursosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mis-cursos')

  const adminSb = createAdminClient()

  const { data: enrollments } = await adminSb
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Para cada curso inscripto, obtener progreso de módulos
  const enrollmentsWithProgress = await Promise.all(
    (enrollments ?? []).map(async (enr) => {
      const course = enr.courses as { id: string; title: string; description: string } | null
      if (!course || enr.status !== 'approved') return { ...enr, progress: null }

      const [{ count: totalModules }, { count: completedModules }] = await Promise.all([
        adminSb.from('course_modules').select('*', { count: 'exact', head: true }).eq('course_id', course.id),
        adminSb.from('module_progress').select('*', { count: 'exact', head: true })
          .eq('course_id', course.id).eq('user_id', user.id),
      ])

      // Quiz results para este curso
      const { data: quizResults } = await adminSb
        .from('quiz_results')
        .select('score, total')
        .eq('course_id', course.id)
        .eq('user_id', user.id)

      const avgScore = quizResults?.length
        ? Math.round(quizResults.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / quizResults.length)
        : null

      return {
        ...enr,
        progress: {
          total: totalModules ?? 0,
          completed: completedModules ?? 0,
          percent: totalModules ? Math.round(((completedModules ?? 0) / totalModules) * 100) : 0,
          quizzes: quizResults?.length ?? 0,
          avgScore,
        }
      }
    })
  )

  const name = user.user_metadata?.full_name ?? user.email

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-[#DCEFE8] flex items-center justify-center text-[#2F7D6B] font-bold text-[20px]">
            {String(name).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[24px] font-semibold text-[#0A0A0A]">Mis cursos</h1>
            <p className="text-[14px] text-[#6E6E73]">{user.email}</p>
          </div>
        </div>

        {!enrollmentsWithProgress.length ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
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
            {enrollmentsWithProgress.map((enr) => {
              const course = enr.courses as { id: string; title: string; description: string } | null
              if (!course) return null
              const p = enr.progress

              return (
                <div key={enr.id} className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#DCEFE8] flex items-center justify-center shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <p className="text-[16px] font-semibold text-[#0A0A0A]">{course.title}</p>
                        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          enr.status === 'approved' ? 'bg-[#DCEFE8] text-[#2F7D6B]'
                          : enr.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-red-50 text-red-500'
                        }`}>
                          {enr.status === 'approved' ? 'Acceso activo' : enr.status === 'pending' ? 'Verificando pago' : 'Rechazado'}
                        </span>
                      </div>

                      {/* Progreso — solo si está aprobado y hay módulos */}
                      {enr.status === 'approved' && p && p.total > 0 && (
                        <div className="mt-4 space-y-3">
                          {/* Barra de progreso */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[12px] font-medium text-[#6E6E73]">
                                Progreso: {p.completed}/{p.total} módulos completados
                              </span>
                              <span className="text-[12px] font-bold text-[#2F7D6B]">{p.percent}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2F7D6B] rounded-full transition-all duration-500"
                                style={{ width: `${p.percent}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats de quizzes */}
                          {p.quizzes > 0 && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-[12px] text-[#6E6E73]">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                                </svg>
                                {p.quizzes} cierre{p.quizzes !== 1 ? 's' : ''} completado{p.quizzes !== 1 ? 's' : ''}
                              </div>
                              {p.avgScore !== null && (
                                <div className="flex items-center gap-1.5 text-[12px] text-[#6E6E73]">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Promedio: <span className="font-semibold text-[#2F7D6B]">{p.avgScore}%</span>
                                </div>
                              )}
                            </div>
                          )}

                          {p.percent === 100 && (
                            <div className="flex items-center gap-2 bg-[#DCEFE8] rounded-xl px-4 py-2.5">
                              <span className="text-[16px]">🎉</span>
                              <p className="text-[13px] font-semibold text-[#2F7D6B]">¡Completaste el curso!</p>
                            </div>
                          )}
                        </div>
                      )}

                      {enr.status === 'approved' && p && p.total === 0 && (
                        <p className="text-[13px] text-[#86868b] mt-2">Los módulos estarán disponibles pronto.</p>
                      )}
                    </div>
                  </div>

                  {enr.status === 'approved' && (
                    <div className="mt-4 pt-4 border-t border-black/5 flex justify-end">
                      <Link href={`/cursos/${course.id}`}
                        className="inline-flex items-center gap-2 text-[#2F7D6B] font-semibold text-[14px] hover:underline">
                        {p && p.percent > 0 ? 'Continuar curso' : 'Ir al curso'} →
                      </Link>
                    </div>
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
