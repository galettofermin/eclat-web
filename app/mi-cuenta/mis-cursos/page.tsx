import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function MisCursosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mi-cuenta/mis-cursos')

  const admin = createAdminClient()

  const { data: enrollments } = await admin
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Progreso por curso
  const items = await Promise.all(
    (enrollments ?? []).map(async (enr) => {
      const course = enr.courses as { id: string; title: string; description: string } | null
      if (!course || enr.status !== 'approved') return { ...enr, course, progress: null }

      const [{ count: total }, { count: completed }] = await Promise.all([
        admin.from('course_modules').select('*', { count: 'exact', head: true }).eq('course_id', course.id),
        admin.from('module_progress').select('*', { count: 'exact', head: true })
          .eq('course_id', course.id).eq('user_id', user.id),
      ])

      const percent = total ? Math.round(((completed ?? 0) / total) * 100) : 0
      return { ...enr, course, progress: { total: total ?? 0, completed: completed ?? 0, percent } }
    })
  )

  const approved = items.filter(i => i.course && i.status === 'approved')

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[12px] font-semibold text-[#2F7D6B] tracking-[0.15em] uppercase mb-2">Mi cuenta</p>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Mis cursos</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">{user.email}</p>
        </div>

        {/* Sin cursos */}
        {!approved.length && (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-[18px] font-semibold text-[#0A0A0A] mb-2">Todavía no tenés cursos</p>
            <p className="text-[14px] text-[#6E6E73] mb-7">Explorá la oferta formativa del equipo ÉCLAT.</p>
            <Link
              href="/formacion"
              className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-[#245f52] transition-colors"
            >
              Ver formación disponible
            </Link>
          </div>
        )}

        {/* Lista de cursos */}
        {approved.length > 0 && (
          <div className="space-y-4">
            {approved.map((enr) => {
              const p = enr.progress
              return (
                <div key={enr.id} className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                  {/* Barra de color superior según progreso */}
                  <div className="h-1 bg-[#F5F5F7]">
                    <div
                      className="h-full bg-[#2F7D6B] transition-all duration-700"
                      style={{ width: `${p?.percent ?? 0}%` }}
                    />
                  </div>

                  <div className="p-6 flex items-start gap-4">
                    {/* Icono curso */}
                    <div className="w-12 h-12 rounded-xl bg-[#DCEFE8] flex items-center justify-center shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-[#0A0A0A] mb-1">{enr.course?.title}</p>

                      {/* Progreso */}
                      {p && p.total > 0 ? (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] text-[#6E6E73]">
                              {p.completed} de {p.total} módulos
                            </span>
                            <span className="text-[12px] font-bold text-[#2F7D6B]">{p.percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2F7D6B] rounded-full transition-all duration-700"
                              style={{ width: `${p.percent}%` }}
                            />
                          </div>
                          {p.percent === 100 && (
                            <p className="text-[12px] font-semibold text-[#2F7D6B] mt-2">✓ Completado</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[13px] text-[#6E6E73] mt-1">Los módulos estarán disponibles pronto.</p>
                      )}
                    </div>

                    {/* Botón continuar */}
                    <Link
                      href={`/cursos/${enr.course?.id}`}
                      className="shrink-0 self-center bg-[#2F7D6B] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#245f52] transition-colors whitespace-nowrap"
                    >
                      {p && p.percent > 0 ? 'Continuar →' : 'Empezar →'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Link volver */}
        <div className="mt-8 text-center">
          <Link href="/mi-cuenta/perfil" className="text-[13px] text-[#6E6E73] hover:text-[#2F7D6B] transition-colors">
            ← Volver a mi perfil
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
