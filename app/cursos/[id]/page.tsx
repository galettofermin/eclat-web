import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic = 'force-dynamic'

const ICON_PDF = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>)
const ICON_VIDEO = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>)
const ICON_YT = (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.74 12.52 12.52 0 0 0-7.64 0 4.83 4.83 0 0 1-3.77 2.74A12.22 12.22 0 0 0 2 12a12.22 12.22 0 0 0 2.41 5.31 4.83 4.83 0 0 1 3.77 2.74 12.52 12.52 0 0 0 7.64 0 4.83 4.83 0 0 1 3.77-2.74A12.22 12.22 0 0 0 22 12a12.22 12.22 0 0 0-2.41-5.31zM10 15.5v-7l6 3.5z"/></svg>)

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default async function CursoPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { pago?: string }
}) {
  const supabase = createClient()
  const adminSb = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await adminSb
    .from('courses').select('*').eq('id', params.id).eq('published', true).single()

  if (!course) redirect('/formacion')

  const { data: modules } = await adminSb
    .from('course_modules').select('*, module_materials(*)').eq('course_id', params.id).order('sort_order')

  let enrollment = null
  if (user) {
    const { data } = await adminSb
      .from('enrollments').select('*').eq('user_id', user.id).eq('course_id', params.id).maybeSingle()
    enrollment = data
  }

  const isApproved = course.is_free || enrollment?.status === 'approved'
  const isPending = !course.is_free && enrollment?.status === 'pending'

  const learnings: string[] = course.learnings
    ? course.learnings.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : []

  const syllabus: string[] = course.syllabus
    ? course.syllabus.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : []

  const moduleCount = modules?.length ?? 0
  const materialCount = modules?.reduce((acc: number, m: any) => acc + (m.module_materials?.length ?? 0), 0) ?? 0

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero del curso */}
      <div className="bg-[#F5F5F7] border-b border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-5 pt-24 pb-10">
          <Link href="/formacion" className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#2F7D6B] transition-colors mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Formación
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <span className={`inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full mb-4 ${
                course.is_free ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-white text-[#6E6E73] border border-black/10'
              }`}>
                {course.badge}
              </span>
              <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.05] mb-4">
                {course.title}
              </h1>
              <p className="text-[16px] md:text-[17px] text-[#424245] leading-relaxed mb-6">
                {course.long_description || course.description}
              </p>

              {/* Meta datos */}
              <div className="flex flex-wrap gap-3">
                {course.duration && (
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 border border-black/[0.08] text-[13px] font-medium text-[#424245]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {course.duration}
                  </div>
                )}
                {course.modality && (
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 border border-black/[0.08] text-[13px] font-medium text-[#424245]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    {course.modality}
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 border border-black/[0.08] text-[13px] font-medium text-[#424245]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><path d="M2 20h20M6 20V10M12 20V4M18 20v-6"/></svg>
                    {course.level}
                  </div>
                )}
                {moduleCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 border border-black/[0.08] text-[13px] font-medium text-[#424245]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    {moduleCount} módulo{moduleCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Card de precio — sticky en desktop */}
            {!course.is_free && (
              <div className="lg:w-72 shrink-0">
                <div className="bg-white rounded-2xl border border-black/[0.08] shadow-lg p-6 lg:sticky lg:top-24">
                  <p className="text-[32px] font-bold text-[#0A0A0A] mb-1">{formatPrice(course.price)}</p>
                  <p className="text-[13px] text-[#6E6E73] mb-5">Acceso completo · {moduleCount} módulos · {materialCount} materiales</p>

                  {!user ? (
                    <Link href={`/login?redirect=/inscripcion/${course.id}`} className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#245f52] transition-colors text-[15px] mb-3">
                      Comprar curso
                    </Link>
                  ) : !enrollment ? (
                    <Link href={`/inscripcion/${course.id}`} className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#245f52] transition-colors text-[15px] mb-3">
                      Comprar curso
                    </Link>
                  ) : isPending ? (
                    <div className="w-full text-center bg-amber-50 text-amber-700 font-semibold py-3.5 rounded-xl text-[14px] mb-3 border border-amber-200">
                      Pago en verificación
                    </div>
                  ) : (
                    <div className="w-full text-center bg-[#DCEFE8] text-[#2F7D6B] font-semibold py-3.5 rounded-xl text-[14px] mb-3">
                      ✓ Acceso activo
                    </div>
                  )}

                  <div className="space-y-2.5 pt-3 border-t border-black/5">
                    {['Acceso de por vida', 'Materiales descargables', 'Certificado de participación'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[13px] text-[#424245]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA para curso gratis */}
            {course.is_free && course.link && (
              <div className="lg:w-72 shrink-0">
                <div className="bg-white rounded-2xl border border-[#2F7D6B]/30 shadow-lg p-6">
                  <p className="text-[20px] font-bold text-[#2F7D6B] mb-1">Gratis</p>
                  <p className="text-[13px] text-[#6E6E73] mb-5">Descarga directa sin registro</p>
                  <a href={course.link} target="_blank" rel="noopener noreferrer"
                    className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#245f52] transition-colors text-[15px]">
                    {course.cta ?? 'Descargar gratis'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banners de pago */}
      {searchParams.pago === 'ok' && (
        <div className="max-w-5xl mx-auto px-5 pt-6">
          <div className="bg-[#DCEFE8] border border-[#2F7D6B]/20 rounded-2xl px-5 py-4 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <p className="text-[15px] font-semibold text-[#2F7D6B]">¡Pago confirmado! Ya tenés acceso al curso.</p>
          </div>
        </div>
      )}

      {/* Cuerpo del curso */}
      <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
        <div className="max-w-2xl space-y-12">

          {/* Qué vas a aprender */}
          {learnings.length > 0 && (
            <div>
              <h2 className="text-[22px] md:text-[24px] font-semibold text-[#0A0A0A] mb-6">Qué vas a aprender</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {learnings.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#F5F5F7] rounded-xl px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[14px] text-[#424245] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Para quién */}
          {course.target_audience && (
            <div>
              <h2 className="text-[22px] md:text-[24px] font-semibold text-[#0A0A0A] mb-4">¿Para quién es este curso?</h2>
              <div className="bg-[#DCEFE8]/50 border border-[#2F7D6B]/20 rounded-2xl p-6">
                <p className="text-[15px] text-[#424245] leading-relaxed">{course.target_audience}</p>
              </div>
            </div>
          )}

          {/* Temario */}
          {syllabus.length > 0 && (
            <div>
              <h2 className="text-[22px] md:text-[24px] font-semibold text-[#0A0A0A] mb-6">Temario del curso</h2>
              <div className="border border-black/[0.08] rounded-2xl overflow-hidden divide-y divide-black/[0.06]">
                {syllabus.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 bg-white hover:bg-[#F5F5F7] transition-colors">
                    <span className="w-6 h-6 rounded-full bg-[#DCEFE8] text-[#2F7D6B] text-[12px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[14px] text-[#0A0A0A]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Módulos */}
          <div>
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#0A0A0A] mb-6">
              {isApproved ? 'Contenido del curso' : 'Contenido'}
            </h2>

            {!modules?.length ? (
              <div className="bg-[#F5F5F7] rounded-2xl p-8 text-center text-[#6E6E73] text-[15px]">
                Los módulos estarán disponibles próximamente.
              </div>
            ) : (
              <div className="border border-black/[0.08] rounded-2xl overflow-hidden divide-y divide-black/[0.06]">
                {modules.map((mod, i) => (
                  <div key={mod.id} className="bg-white">
                    <div className={`flex items-center gap-3 px-5 py-4 ${isApproved ? '' : 'opacity-75'}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                        isApproved ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#F5F5F7] text-[#86868b]'
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-[14px] md:text-[15px] font-semibold text-[#0A0A0A] flex-1">{mod.title}</p>
                      {isApproved ? (
                        mod.module_materials?.length > 0 && (
                          <span className="text-[12px] text-[#86868b]">{mod.module_materials.length} archivo{mod.module_materials.length !== 1 ? 's' : ''}</span>
                        )
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      )}
                    </div>

                    {isApproved && mod.module_materials?.length > 0 && (
                      <div className="px-5 pb-4 pt-1 bg-[#F9F9F9] border-t border-black/[0.04] space-y-1.5">
                        {mod.module_materials.map((mat: { id: string; type: string; title: string; url: string }) => (
                          <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white transition-colors group">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              mat.type === 'pdf' ? 'bg-red-50 text-red-500' :
                              mat.type === 'video' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                            }`}>
                              {mat.type === 'pdf' ? ICON_PDF : mat.type === 'video' ? ICON_VIDEO : ICON_YT}
                            </span>
                            <span className="text-[13px] font-medium text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors flex-1 truncate">
                              {mat.title}
                            </span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5" className="shrink-0">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CTA bloqueado */}
            {!isApproved && !isPending && !course.is_free && (
              <div className="mt-6 bg-[#0A0A0A] rounded-2xl p-7 md:p-8 text-center text-white">
                <p className="text-[17px] font-semibold mb-2">
                  {!user ? 'Registrate para acceder' : `Desbloqueá el contenido completo`}
                </p>
                <p className="text-white/55 text-[14px] mb-6">
                  {!user ? 'Creá tu cuenta gratis y comprá el curso.' : `${formatPrice(course.price)} · Acceso de por vida`}
                </p>
                {!user ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/registro" className="bg-white text-[#0A0A0A] font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-white/90 transition-colors">
                      Crear cuenta gratis
                    </Link>
                    <Link href={`/login?redirect=/inscripcion/${course.id}`} className="border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-white/10 transition-colors">
                      Ya tengo cuenta
                    </Link>
                  </div>
                ) : (
                  <Link href={`/inscripcion/${course.id}`} className="inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-3 rounded-full text-[15px] hover:bg-white/90 transition-colors">
                    Comprar — {formatPrice(course.price)}
                  </Link>
                )}
              </div>
            )}

            {isPending && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-7 text-center">
                <p className="text-[17px] font-semibold text-amber-800 mb-2">Tu pago está siendo verificado</p>
                <p className="text-amber-700 text-[14px]">Una vez confirmado, el contenido se desbloqueará automáticamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
