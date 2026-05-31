import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export const dynamic = 'force-dynamic'

const ICON_PDF = (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>)
const ICON_VIDEO = (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>)
const ICON_YT = (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.74 12.52 12.52 0 0 0-7.64 0 4.83 4.83 0 0 1-3.77 2.74A12.22 12.22 0 0 0 2 12a12.22 12.22 0 0 0 2.41 5.31 4.83 4.83 0 0 1 3.77 2.74 12.52 12.52 0 0 0 7.64 0 4.83 4.83 0 0 1 3.77-2.74A12.22 12.22 0 0 0 22 12a12.22 12.22 0 0 0-2.41-5.31zM10 15.5v-7l6 3.5z" /></svg>)

export default async function CursoPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { pago?: string }
}) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await adminSupabase
    .from('courses').select('*').eq('id', params.id).eq('published', true).single()

  if (!course) redirect('/formacion')

  const { data: modules } = await adminSupabase
    .from('course_modules').select('*, module_materials(*)').eq('course_id', params.id).order('sort_order')

  let enrollment = null
  if (user) {
    const { data } = await adminSupabase
      .from('enrollments').select('*').eq('user_id', user.id).eq('course_id', params.id).single()
    enrollment = data
  }

  const isApproved = course.is_free || enrollment?.status === 'approved'
  const isPending = !course.is_free && enrollment?.status === 'pending'

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 pt-24 md:pt-28 pb-16 md:pb-20">

        {/* Breadcrumb */}
        <Link href="/formacion" className="text-[13px] text-[#6E6E73] hover:text-[#2F7D6B] transition-colors inline-flex items-center gap-1 mb-6">
          ← Formación
        </Link>

        {/* Header — stacks on mobile */}
        <div className="mb-8">
          <span className={`inline-block text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4 ${
            course.is_free ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#F5F5F7] text-[#6E6E73]'
          }`}>
            {course.badge}
          </span>
          <h1 className="text-[clamp(1.8rem,5vw,2.8rem)] font-semibold tracking-tight text-[#0A0A0A] mb-4 leading-tight">
            {course.title}
          </h1>
          <p className="text-[16px] md:text-[17px] text-[#6E6E73] leading-relaxed max-w-2xl mb-6">
            {course.description}
          </p>

          {/* Price card — full width on mobile */}
          {!course.is_free && (
            <div className="bg-[#F5F5F7] rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-lg">
              <div>
                <p className="text-[28px] md:text-[32px] font-bold text-[#0A0A0A] leading-none">{formatPrice(course.price)}</p>
                <p className="text-[13px] text-[#6E6E73] mt-1">Acceso completo al curso</p>
              </div>
              <div className="shrink-0">
                {!user ? (
                  <Link href={`/login?redirect=/inscripcion/${course.id}`} className="block bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-[#245f52] transition-colors text-center">
                    Comprar curso
                  </Link>
                ) : !enrollment ? (
                  <Link href={`/inscripcion/${course.id}`} className="block bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-[#245f52] transition-colors text-center">
                    Comprar curso
                  </Link>
                ) : isPending ? (
                  <div className="bg-amber-50 text-amber-700 text-[13px] font-medium px-4 py-3 rounded-xl text-center">
                    Pago en verificación
                  </div>
                ) : (
                  <div className="bg-[#DCEFE8] text-[#2F7D6B] text-[13px] font-semibold px-4 py-3 rounded-xl text-center">
                    ✓ Acceso activo
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Banners de estado */}
        {searchParams.pago === 'ok' && (
          <div className="mb-6 bg-[#DCEFE8] border border-[#2F7D6B]/20 rounded-2xl px-5 py-4 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <p className="text-[15px] font-semibold text-[#2F7D6B]">¡Pago confirmado! Ya tenés acceso al curso.</p>
          </div>
        )}
        {searchParams.pago === 'pendiente' && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <p className="text-[15px] font-semibold text-amber-700">Tu pago está siendo procesado. Recibirás acceso en breve.</p>
          </div>
        )}

        {/* Módulos */}
        <div className="border-t border-black/5 pt-8">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-[#0A0A0A] mb-5">
            {isApproved ? 'Contenido del curso' : 'Lo que incluye este curso'}
          </h2>

          {!modules?.length ? (
            <div className="bg-[#F5F5F7] rounded-2xl p-8 text-center text-[#6E6E73] text-[15px]">
              Los módulos estarán disponibles próximamente.
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((mod, i) => (
                <div key={mod.id} className="border border-black/[0.07] rounded-2xl overflow-hidden">
                  <div className={`px-5 py-4 flex items-center gap-3 ${isApproved ? 'bg-white' : 'bg-[#F5F5F7]'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${isApproved ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#E8E8E8] text-[#86868b]'}`}>
                      {i + 1}
                    </span>
                    <p className="text-[14px] md:text-[15px] font-semibold text-[#0A0A0A] flex-1">{mod.title}</p>
                    {!isApproved ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    ) : mod.module_materials?.length > 0 ? (
                      <span className="text-[12px] text-[#6E6E73] shrink-0">{mod.module_materials.length} archivo{mod.module_materials.length !== 1 ? 's' : ''}</span>
                    ) : null}
                  </div>

                  {isApproved && mod.module_materials?.length > 0 && (
                    <div className="px-5 pb-4 pt-2 bg-white border-t border-black/5 space-y-1.5">
                      {mod.module_materials.map((mat: { id: string; type: string; title: string; url: string }) => (
                        <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[#F5F5F7] transition-colors group">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mat.type === 'pdf' ? 'bg-red-50 text-red-500' : mat.type === 'video' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                            {mat.type === 'pdf' ? ICON_PDF : mat.type === 'video' ? ICON_VIDEO : ICON_YT}
                          </span>
                          <span className="text-[13px] md:text-[14px] font-medium text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors flex-1 truncate">
                            {mat.title}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.5" className="shrink-0">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA si no tiene acceso */}
          {!isApproved && !isPending && (
            <div className="mt-8 bg-[#0A0A0A] rounded-2xl p-7 md:p-8 text-center text-white">
              <p className="text-[17px] md:text-[18px] font-semibold mb-2">
                {!user ? 'Creá una cuenta para acceder' : `Comprá el curso para desbloquear — ${formatPrice(course.price)}`}
              </p>
              <p className="text-white/60 text-[14px] md:text-[15px] mb-6">
                {!user ? 'Es gratis. Luego podés adquirir el curso.' : 'Acceso completo a todos los módulos y materiales.'}
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/registro" className="bg-white text-[#0A0A0A] font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-white/90 transition-colors">
                    Registrarme gratis
                  </Link>
                  <Link href={`/login?redirect=/inscripcion/${course.id}`} className="border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-white/10 transition-colors">
                    Ya tengo cuenta
                  </Link>
                </div>
              ) : (
                <Link href={`/inscripcion/${course.id}`} className="inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-3 rounded-full text-[15px] hover:bg-white/90 transition-colors">
                  Comprar ahora
                </Link>
              )}
            </div>
          )}

          {isPending && (
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-7 text-center">
              <p className="text-[17px] font-semibold text-amber-800 mb-2">Tu pago está siendo verificado</p>
              <p className="text-amber-700 text-[14px] md:text-[15px]">
                Una vez confirmado, el contenido se desbloqueará automáticamente.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
