import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  const [{ count: articles }, { count: courses }, { count: services }] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Escritos', count: articles ?? 0, href: '/admin/escritos', bg: 'bg-[#DCEFE8]', text: 'text-[#2F7D6B]' },
    { label: 'Cursos', count: courses ?? 0, href: '/admin/formacion', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Servicios', count: services ?? 0, href: '/admin/servicios', bg: 'bg-violet-50', text: 'text-violet-600' },
  ]

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#0A0A0A] mb-1">Dashboard</h1>
      <p className="text-[15px] text-[#6E6E73] mb-10">Bienvenido al panel de administración de ÉCLAT.</p>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-black/5 p-6 hover:border-[#2F7D6B]/30 hover:shadow-sm transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-[20px] font-bold mb-4`}>
              {s.count}
            </div>
            <p className="text-[17px] font-semibold text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors">
              {s.label}
            </p>
            <p className="text-[13px] text-[#6E6E73] mt-0.5">Administrar →</p>
          </Link>
        ))}
      </div>

      {/* Acciones rápidas */}
      <h2 className="text-[16px] font-semibold text-[#0A0A0A] mb-4">Acciones rápidas</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/escritos/nuevo"
          className="flex items-center gap-4 bg-[#2F7D6B] text-white rounded-2xl p-6 hover:bg-[#245f52] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <p className="text-[16px] font-semibold">Nuevo escrito</p>
            <p className="text-white/70 text-[13px]">Publicar un artículo</p>
          </div>
        </Link>
        <Link
          href="/admin/formacion/nuevo"
          className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl p-6 hover:border-[#2F7D6B]/30 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCEFE8] flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <p className="text-[16px] font-semibold text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors">Nuevo curso</p>
            <p className="text-[#6E6E73] text-[13px]">Agregar material de formación</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
