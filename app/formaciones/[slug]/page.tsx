import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AppSidebar from '@/components/AppSidebar'
import { DIRECTOR_EMAIL, WHATSAPP_URL } from '@/lib/constants'
import type { QuizQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default async function FormacionPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  const isDirector = user?.email === DIRECTOR_EMAIL

  const { data: course } = await admin
    .from('courses').select('*').eq('id', params.slug).eq('published', true).single()
  if (!course) redirect('/formaciones')

  const { data: modulesRaw } = await admin
    .from('course_modules').select('*, module_materials(*)').eq('course_id', params.slug).order('sort_order')

  const modules = await Promise.all((modulesRaw ?? []).map(async mod => {
    const { data: quiz } = await admin
      .from('module_quizzes').select('*, quiz_questions(*)').eq('module_id', mod.id).maybeSingle()
    return { ...mod, quiz: quiz ?? null, questions: (quiz?.quiz_questions ?? []) as QuizQuestion[] }
  }))

  let enrollment = null
  if (user) {
    const { data } = await admin.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', params.slug).maybeSingle()
    enrollment = data
  }

  const { count: studentCount } = await admin
    .from('enrollments').select('*', { count: 'exact', head: true }).eq('course_id', params.slug).eq('status', 'approved')

  const isApproved = course.is_free || enrollment?.status === 'approved' || isDirector
  const isPending = !course.is_free && enrollment?.status === 'pending'

  const userEmail = user?.email ?? ''
  const userName = user?.user_metadata?.full_name ?? ''

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
      <AppSidebar userEmail={userEmail} userName={userName} isDirector={isDirector} />

      <main className="flex-1" style={{ marginLeft: 210 }}>
        {/* Hero de la formación */}
        <div style={{ background: 'var(--eclat-bg-green)', borderBottom: '1px solid var(--eclat-border)', padding: '32px 40px 28px' }}>
          {/* Breadcrumb */}
          <p className="text-[11px] mb-4" style={{ color: 'var(--eclat-text-3)' }}>
            <Link href="/" className="hover:underline">Inicio</Link>
            {' / '}
            <Link href="/formaciones" className="hover:underline">Formaciones</Link>
            {' / '}
            <span style={{ color: 'var(--eclat-text-2)' }}>{course.title}</span>
          </p>

          <div className="flex gap-10 items-start">
            <div className="flex-1">
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full mb-4"
                style={{ background: 'white', color: 'var(--eclat-mid)', border: '1px solid var(--eclat-border)' }}
              >
                {course.badge || 'Formación'}
              </span>
              <h1
                className="mb-3 leading-snug"
                style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: 'var(--eclat-text)' }}
              >
                {course.title}
              </h1>
              <p className="text-[13px] leading-relaxed mb-5 max-w-2xl" style={{ color: 'var(--eclat-text-2)' }}>
                {course.long_description || course.description}
              </p>
              {/* Metadatos */}
              <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>
                {modules.length > 0 && <span>📚 {modules.length} módulos</span>}
                {course.duration && <span>⏱ {course.duration}</span>}
                {studentCount! > 0 && <span>👥 {studentCount} alumnos</span>}
                <span>🎓 Certificado incluido</span>
                {course.level && <span>📊 {course.level}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex gap-6 p-8">
          {/* Módulos */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--eclat-text)' }}>
              Contenido del curso
            </h2>

            {modules.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-white" style={{ border: '1px solid var(--eclat-border)' }}>
                <p className="text-[13px]" style={{ color: 'var(--eclat-text-3)' }}>Los módulos estarán disponibles pronto.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="bg-white rounded-xl overflow-hidden"
                    style={{ border: '1px solid var(--eclat-border)' }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      {/* Número */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                        style={{
                          background: isApproved ? 'var(--eclat-dark)' : 'var(--eclat-border)',
                          color: isApproved ? 'white' : 'var(--eclat-text-3)',
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium" style={{ color: 'var(--eclat-text)' }}>{mod.title}</p>
                        {mod.subtitle && <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{mod.subtitle}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-[11px]" style={{ color: 'var(--eclat-text-4)' }}>
                        {isApproved ? (
                          <span style={{ color: 'var(--eclat-mid)' }}>✓ Disponible</span>
                        ) : (
                          <span>🔒</span>
                        )}
                      </div>
                    </div>

                    {/* Materiales (si tiene acceso) */}
                    {isApproved && mod.module_materials?.length > 0 && (
                      <div className="px-4 pb-3 pt-1 space-y-1.5" style={{ borderTop: '1px solid var(--eclat-border)', background: 'var(--eclat-cream)' }}>
                        {mod.module_materials.map((mat: any) => (
                          <a
                            key={mat.id}
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-colors hover:opacity-80"
                            style={{ color: 'var(--eclat-text-2)' }}
                          >
                            <span className="text-[13px]">
                              {mat.type === 'pdf' ? '📄' : mat.type === 'video' ? '🎥' : '📗'}
                            </span>
                            <span className="text-[12px] flex-1 truncate">{mat.title}</span>
                            <span className="text-[10px]" style={{ color: 'var(--eclat-mid)' }}>
                              {mat.type === 'pdf' ? 'Descargar' : mat.type === 'video' ? 'Ver' : 'Leer'}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CTA sin acceso */}
            {!isApproved && !isPending && !course.is_free && (
              <div
                className="mt-6 rounded-xl p-6"
                style={{ background: 'var(--eclat-dark)', color: 'white' }}
              >
                <p className="text-[15px] font-semibold mb-1">
                  {!user ? 'Registrate para acceder' : 'Desbloqueá el contenido completo'}
                </p>
                <p className="text-[12px] mb-4 opacity-70">
                  {!user ? 'Creá tu cuenta gratis y comprá el curso.' : `${formatPrice(course.price)} · Acceso permanente`}
                </p>
                <div className="flex gap-3">
                  {!user ? (
                    <>
                      <Link href="/registro" className="px-5 py-2.5 text-[12px] font-medium rounded-lg bg-white" style={{ color: 'var(--eclat-dark)' }}>Crear cuenta</Link>
                      <Link href={`/login?redirect=/formaciones/${params.slug}`} className="px-5 py-2.5 text-[12px] font-medium rounded-lg border border-white/30 text-white">Ya tengo cuenta</Link>
                    </>
                  ) : (
                    <Link href={`/inscripcion/${course.id}`} className="px-5 py-2.5 text-[12px] font-medium rounded-lg bg-white" style={{ color: 'var(--eclat-dark)' }}>
                      Inscribirme — {formatPrice(course.price)}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar derecho */}
          <div className="w-64 shrink-0 space-y-4">
            {/* Card precio */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--eclat-border)' }}>
              <div className="px-4 py-4" style={{ background: 'var(--eclat-bg-green)', borderBottom: '1px solid var(--eclat-border)' }}>
                <p className="text-[24px] font-light" style={{ color: 'var(--eclat-text)' }}>
                  {course.is_free ? 'Gratuito' : formatPrice(course.price)}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>
                  {course.is_free ? 'Sin costo' : 'Pago único · Acceso permanente'}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {['Videos y material', 'PDFs descargables', 'Certificado de aprobación', 'Mensajería directa', 'Acceso sin vencimiento'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--eclat-text-2)' }}>
                    <span style={{ color: 'var(--eclat-mid)' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              {!isApproved && !isPending && !course.is_free && user && (
                <div className="px-4 pb-4">
                  <Link
                    href={`/inscripcion/${course.id}`}
                    className="block text-center py-2.5 text-[13px] font-semibold rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: '#009EE3', color: 'white' }}
                  >
                    Pagar con Mercado Pago
                  </Link>
                </div>
              )}
            </div>

            {/* Card contacto */}
            <div className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--eclat-border)' }}>
              <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--eclat-text)' }}>¿Tenés preguntas?</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 text-[12px] font-medium rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
              >
                Consultar al equipo
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
