import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIRECTOR_EMAIL, WA_URL } from '@/lib/constants'
import { WaIcon } from '@/components/WaIcon'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mi cuenta', robots: { index: false } }

type EnrolledCourse = { id: string; title: string; description: string | null }

export default async function MiCuentaPage({ searchParams }: { searchParams: { pago?: string } }) {
  const pagoOk = searchParams.pago === 'ok'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Se conserva ?pago=ok para mostrar el cartel después de iniciar sesión
  if (!user) redirect(`/login?redirect=${encodeURIComponent(pagoOk ? '/mi-cuenta?pago=ok' : '/mi-cuenta')}`)
  if (user.email === DIRECTOR_EMAIL) redirect('/admin')

  const { data: enrollments } = await createAdminClient()
    .from('enrollments')
    .select('course_id, courses(id, title, description)')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const courses = (enrollments ?? [])
    .map(e => e.courses as unknown as EnrolledCourse | null)
    .filter((c): c is EnrolledCourse => !!c)

  const meta = user.user_metadata ?? {}
  const nombre = meta.nombre || String(meta.full_name ?? '').split(' ')[0] || user.email

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <h1>Hola, <em>{nombre}.</em></h1>
          <p className="phead__lede">
            {courses.length ? 'Estos son los cursos que tenés habilitados.' : 'Este es tu espacio en ÉCLAT.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {/* Vuelta desde Mercado Pago: el webhook puede tardar unos segundos en habilitar el curso */}
          {pagoOk && (
            <div role="status" style={{ maxWidth: 560, margin: '0 auto 32px', padding: '16px 20px', borderRadius: 14, background: '#DCEFE8', border: '1px solid rgba(47,125,107,.2)', textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--green-700)' }}>¡Pago recibido!</p>
              <p style={{ fontSize: 14, color: 'var(--slate-900)', marginTop: 4 }}>
                {courses.length
                  ? 'Ya tenés acceso a tu curso.'
                  : <>Estamos confirmándolo con Mercado Pago. Si el curso no aparece todavía, <a href="/mi-cuenta?pago=ok" style={{ color: 'var(--green-700)', fontWeight: 600 }}>recargá la página</a> en unos segundos.</>}
              </p>
            </div>
          )}

          {/* Recién pagó y el curso todavía no aparece: el cartel de arriba alcanza */}
          {courses.length === 0 && pagoOk ? null : courses.length === 0 ? (
            <div className="writing" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 560, margin: '0 auto' }}>
              <p style={{ fontSize: 17, color: 'var(--slate-900)', flex: 'none' }}>
                Todavía no tenés cursos habilitados. Escribinos por WhatsApp para inscribirte.
              </p>
              <a
                className="btn-wa"
                style={{ alignSelf: 'center', marginTop: 12 }}
                href={WA_URL('Hola ÉCLAT, quiero inscribirme en un curso.')}
                target="_blank" rel="noopener noreferrer"
              >
                <WaIcon />Escribir por WhatsApp
              </a>
            </div>
          ) : (
            <div className="writings">
              {courses.map(c => (
                <div key={c.id} className="writing">
                  <h3>{c.title}</h3>
                  {c.description && <p>{c.description}</p>}
                  <Link href={`/cursos/${c.id}`} className="btn btn--primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                    Ir al curso
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
