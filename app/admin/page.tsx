import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default async function AdminDashboard() {
  const supabase = createClient()
  const admin = createAdminClient()

  const [
    { count: totalCourses },
    { count: totalEnrollments },
    { data: recentEnrollments },
    { data: courses },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    admin.from('enrollments').select('*, courses(title)').order('created_at', { ascending: false }).limit(6),
    admin.from('courses').select('id, title, price, is_free, published').order('sort_order'),
  ])

  const stats = [
    { label: 'Alumnos registrados', value: totalEnrollments ?? 0, color: 'var(--eclat-dark)' },
    { label: 'Formaciones activas', value: totalCourses ?? 0, color: 'var(--eclat-dark-3)' },
    { label: 'Certificados emitidos', value: 0, color: 'var(--eclat-green)' },
    { label: 'Mensajes sin leer', value: 0, color: 'var(--eclat-mid)' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Dashboard</h1>
        <p className="text-[13px]" style={{ color: 'var(--eclat-text-3)' }}>Panel del director · Centro ÉCLAT</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-5"
            style={{ border: '1px solid var(--eclat-border)' }}
          >
            <p className="text-[32px] font-light mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[12px]" style={{ color: 'var(--eclat-text-3)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Dos columnas */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Inscripciones recientes */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--eclat-border)' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Inscripciones recientes</h2>
            <Link href="/admin/inscripciones" className="text-[11px]" style={{ color: 'var(--eclat-mid)' }}>Ver todas →</Link>
          </div>
          {!recentEnrollments?.length ? (
            <p className="text-[13px] px-5 py-8 text-center" style={{ color: 'var(--eclat-text-3)' }}>Sin inscripciones todavía.</p>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--eclat-border)' }}>
              {recentEnrollments.map(enr => (
                <div key={enr.id} className="px-5 py-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                    style={{ background: 'var(--eclat-bg-green)', color: 'var(--eclat-dark-3)' }}
                  >
                    {enr.user_email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: 'var(--eclat-text)' }}>{enr.user_email}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--eclat-text-3)' }}>
                      {(enr.courses as any)?.title ?? '—'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      enr.status === 'approved' ? 'bg-green-50 text-green-700' :
                      enr.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {enr.status === 'approved' ? 'Activo' : enr.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--eclat-border)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Acciones rápidas</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: 'Nuevo escrito', href: '/admin/escritos/nuevo', desc: 'Publicar un artículo' },
              { label: 'Nueva formación', href: '/admin/formacion/nuevo', desc: 'Agregar curso' },
              { label: 'Inscripciones pendientes', href: '/admin/inscripciones', desc: 'Revisar pagos' },
              { label: 'Suscriptores', href: '/admin/suscriptores', desc: 'Lista de emails' },
              { label: 'Configuración del sitio', href: '/admin/configuracion', desc: 'Textos y media' },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:opacity-80"
                style={{ background: 'var(--eclat-bg-green)', border: '1px solid var(--eclat-border)' }}
              >
                <div className="flex-1">
                  <p className="text-[12px] font-semibold" style={{ color: 'var(--eclat-text)' }}>{a.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{a.desc}</p>
                </div>
                <span style={{ color: 'var(--eclat-text-4)', fontSize: 16 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Editor de formaciones */}
      <div className="bg-white rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--eclat-border)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--eclat-border)' }}>
          <h2 className="text-[13px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Formaciones</h2>
          <Link
            href="/admin/formacion/nuevo"
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
          >
            + Nueva
          </Link>
        </div>
        {!courses?.length ? (
          <p className="text-[13px] px-5 py-8 text-center" style={{ color: 'var(--eclat-text-3)' }}>No hay formaciones todavía.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--eclat-border)' }}>
            {courses.map(c => (
              <div key={c.id} className="bg-white p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--eclat-text)' }}>{c.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>
                    {c.is_free ? 'Gratuita' : formatPrice(c.price)} · {c.published ? 'Publicada' : 'Borrador'}
                  </p>
                </div>
                <Link href={`/admin/formacion/${c.id}`} className="shrink-0 p-1.5 rounded-lg hover:opacity-70 transition-opacity" title="Editar" style={{ color: 'var(--eclat-mid)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
