import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIRECTOR_EMAIL, WA_URL } from '@/lib/constants'
import { WaIcon } from '@/components/WaIcon'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mi cuenta — ÉCLAT', robots: { index: false } }

type Enrollment = {
  id: string
  status: string
  payment_method: string
  amount: number | null
  created_at: string
  approved_at: string | null
  course_id: string
  courses: {
    id: string
    title: string
    description: string | null
    published: boolean
  } | null
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 20,
        background: '#DCEFE8', color: '#1E6B59',
        fontSize: 12, fontWeight: 600,
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Habilitado
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 20,
        background: '#FFF3CD', color: '#856404',
        fontSize: 12, fontWeight: 600,
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Pendiente de aprobación
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: '#FEE2E2', color: '#991B1B',
      fontSize: 12, fontWeight: 600,
    }}>
      Rechazado
    </span>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function MiCuentaPage({ searchParams }: { searchParams: { pago?: string } }) {
  const pagoOk = searchParams.pago === 'ok'
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirect=${encodeURIComponent(pagoOk ? '/mi-cuenta?pago=ok' : '/mi-cuenta')}`)
  if (user.email === DIRECTOR_EMAIL) redirect('/admin')

  const { data: enrollments } = await createAdminClient()
    .from('enrollments')
    .select('id, status, payment_method, amount, created_at, approved_at, course_id, courses(id, title, description, published)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allEnrollments = (enrollments ?? []) as unknown as Enrollment[]
  const approved = allEnrollments.filter(e => e.status === 'approved' && e.courses)
  const pending = allEnrollments.filter(e => e.status === 'pending' && e.courses)

  const meta = user.user_metadata ?? {}
  const nombre = meta.nombre || String(meta.full_name ?? '').trim().split(/\s+/)[0] || user.email?.split('@')[0] || 'Alumno'
  const inicial = nombre.charAt(0).toUpperCase()

  return (
    <>
      {/* Hero personalizado */}
      <section style={{
        background: 'linear-gradient(135deg, #1B2B26 0%, #2F7D6B 100%)',
        padding: '48px 0 40px',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 700, color: '#fff',
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.25)',
          }}>
            {inicial}
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2 }}>
              Hola, {nombre}.
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {user.email}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/mi-cuenta/perfil" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 13, fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
              Mi perfil
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">

          {/* Banner de pago recibido */}
          {pagoOk && (
            <div role="status" style={{
              maxWidth: 600, margin: '0 auto 32px',
              padding: '16px 20px', borderRadius: 14,
              background: '#DCEFE8', border: '1px solid rgba(47,125,107,.25)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#1E6B59' }}>¡Pago recibido!</p>
              <p style={{ fontSize: 14, color: '#1B2B26', marginTop: 4 }}>
                {approved.length > 0
                  ? 'Ya tenés acceso a tu curso.'
                  : <>Estamos confirmándolo. Si el curso no aparece, <a href="/mi-cuenta?pago=ok" style={{ color: '#2F7D6B', fontWeight: 600 }}>recargá la página</a> en unos segundos.</>}
              </p>
            </div>
          )}

          {/* Sin inscripciones */}
          {allEnrollments.length === 0 && !pagoOk && (
            <div style={{
              textAlign: 'center', padding: '60px 24px', maxWidth: 520, margin: '0 auto',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#F0F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1B2B26', margin: '0 0 8px' }}>
                Todavía no tenés cursos
              </h2>
              <p style={{ fontSize: 16, color: '#6E6E73', lineHeight: 1.5, marginBottom: 24 }}>
                Escribinos por WhatsApp para consultar sobre nuestras formaciones y comenzar el proceso de inscripción.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <a
                  className="btn-wa"
                  href={WA_URL('Hola ÉCLAT, quiero inscribirme en un curso.')}
                  target="_blank" rel="noopener noreferrer"
                >
                  <WaIcon />Escribir por WhatsApp
                </a>
                <Link href="/formacion" style={{ fontSize: 14, color: '#2F7D6B', fontWeight: 600, textDecoration: 'none' }}>
                  Ver cursos disponibles →
                </Link>
              </div>
            </div>
          )}

          {/* Cursos habilitados */}
          {approved.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#6E6E73',
                marginBottom: 16,
              }}>
                Mis formaciones
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {approved.map(e => (
                  <div key={e.id} style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid rgba(0,0,0,0.07)',
                    padding: '20px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                    flexWrap: 'wrap',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    {/* Ícono de libro */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: '#DCEFE8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1B2B26', margin: 0 }}>
                          {e.courses?.title}
                        </h3>
                        <StatusBadge status={e.status} />
                      </div>
                      {e.courses?.description && (
                        <p style={{ fontSize: 14, color: '#6E6E73', margin: '0 0 4px', lineHeight: 1.4 }}>
                          {e.courses.description}
                        </p>
                      )}
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                        Habilitado el {formatDate(e.approved_at ?? e.created_at)}
                      </p>
                    </div>
                    <Link
                      href={`/cursos/${e.courses?.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '10px 20px', borderRadius: 10,
                        background: '#2F7D6B', color: '#fff',
                        fontSize: 14, fontWeight: 600,
                        textDecoration: 'none', flexShrink: 0,
                        transition: 'background .2s',
                      }}
                    >
                      Acceder
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inscripciones pendientes */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#6E6E73',
                marginBottom: 16,
              }}>
                Solicitudes en proceso
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pending.map(e => (
                  <div key={e.id} style={{
                    background: '#FFFBEB',
                    borderRadius: 14,
                    border: '1px solid #FCD34D',
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#1B2B26', margin: 0 }}>
                          {e.courses?.title}
                        </p>
                        <StatusBadge status={e.status} />
                      </div>
                      <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                        Solicitud enviada el {formatDate(e.created_at)} · Te avisamos cuando se apruebe.
                      </p>
                    </div>
                    <a
                      href={WA_URL(`Hola ÉCLAT, quiero consultar el estado de mi inscripción al curso "${e.courses?.title}".`)}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 8,
                        background: 'rgba(37,211,102,0.12)', color: '#15803d',
                        fontSize: 13, fontWeight: 600,
                        textDecoration: 'none', flexShrink: 0,
                      }}
                    >
                      Consultar
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer de navegación */}
          {allEnrollments.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 12,
              padding: '24px 0',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/formacion" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 14, color: '#2F7D6B', fontWeight: 600, textDecoration: 'none',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  Ver más formaciones
                </Link>
                <a
                  href={WA_URL('Hola ÉCLAT, quiero hacer una consulta.')}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 14, color: '#6E6E73', fontWeight: 500, textDecoration: 'none' }}
                >
                  Contactarnos →
                </a>
              </div>
              <Link href="/mi-cuenta/perfil" style={{
                fontSize: 13, color: '#9ca3af', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
                </svg>
                Cambiar contraseña
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
