import { createClient } from '@/lib/supabase/server'
import AppSidebar from '@/components/AppSidebar'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Course, Service } from '@/lib/types'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const AREAS = [
  { nombre: 'Psicología', desc: 'Atención individual, familiar y grupal', icon: '🧠' },
  { nombre: 'Psicopedagogía', desc: 'Aprendizaje y subjetividad', icon: '📖' },
  { nombre: 'Fonoaudiología', desc: 'Lenguaje, voz y comunicación', icon: '🗣️' },
  { nombre: 'Psicomotricidad', desc: 'Cuerpo y desarrollo', icon: '🤸' },
  { nombre: 'Docente de apoyo', desc: 'Acompañamiento en lo escolar', icon: '🏫' },
  { nombre: 'Acompañante terapéutico', desc: 'Presencia en la vida cotidiana', icon: '🤝' },
  { nombre: 'Evaluaciones', desc: 'Diagnóstico integral y situado', icon: '📋' },
  { nombre: 'Arteterapia', desc: 'El arte como espacio de elaboración', icon: '🎨' },
]

export default async function Home() {
  let courses: Course[] | undefined
  let userName = ''
  let userEmail = ''
  let isDirector = false

  try {
    const supabase = createClient()
    const [{ data: { user } }, { data: c }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('courses').select('*').eq('published', true).order('sort_order').limit(4),
    ])
    if (c?.length) courses = c
    if (user) {
      userEmail = user.email ?? ''
      userName = user.user_metadata?.full_name ?? userEmail.split('@')[0] ?? ''
      isDirector = user.email === DIRECTOR_EMAIL
    }
  } catch {}

  const greeting = userName
    ? `¡Hola, ${userName.split(' ')[0]}!`
    : '¡Hola!'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
      <AppSidebar userEmail={userEmail} userName={userName} isDirector={isDirector} />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col" style={{ marginLeft: 210, minHeight: '100vh' }}>

        {/* Topbar */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
          style={{ background: 'var(--eclat-cream)', borderBottom: '1px solid var(--eclat-border)' }}
        >
          <div>
            <p className="font-semibold text-[20px]" style={{ color: 'var(--eclat-text)' }}>{greeting}</p>
            <p className="text-[13px] italic" style={{ color: 'var(--eclat-text-3)' }}>¿Qué te trajo hoy acá?</p>
          </div>
          <Link
            href="/formaciones"
            className="text-[12px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
          >
            Comenzar un recorrido
          </Link>
        </div>

        {/* Body con padding */}
        <div className="flex gap-6 px-8 py-7 flex-1">

          {/* Columna principal */}
          <div className="flex-1 min-w-0">

            {/* ── HERO ── */}
            <div
              className="relative overflow-hidden mb-7"
              style={{
                background: 'var(--eclat-bg-green)',
                border: '1px solid var(--eclat-border)',
                borderRadius: 10,
                padding: '44px 48px',
              }}
            >
              {/* Decoración SVG */}
              <svg
                className="absolute right-0 top-0 pointer-events-none"
                width="220" height="220" viewBox="0 0 220 220"
                style={{ opacity: 0.07 }}
              >
                <circle cx="180" cy="40" r="60" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
                <circle cx="180" cy="40" r="35" fill="none" stroke="#3a5444" strokeWidth="1"/>
                <line x1="120" y1="0" x2="220" y2="100" stroke="#3a5444" strokeWidth="1"/>
                <line x1="140" y1="0" x2="220" y2="80" stroke="#3a5444" strokeWidth="0.8"/>
                <line x1="160" y1="0" x2="220" y2="60" stroke="#3a5444" strokeWidth="0.6"/>
              </svg>

              {/* Kicker */}
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
                style={{ color: 'var(--eclat-green)' }}
              >
                ÉCLAT · Centro de atención integral
              </p>

              {/* Título */}
              <h1
                className="mb-4 leading-tight"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 28,
                  fontWeight: 400,
                  color: 'var(--eclat-text)',
                  maxWidth: 560,
                }}
              >
                Salud mental, educación y acompañamiento{' '}
                <em style={{ color: 'var(--eclat-dark-3)', fontStyle: 'italic' }}>interdisciplinario.</em>
              </h1>

              {/* Bajada */}
              <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--eclat-text-2)', maxWidth: 520 }}>
                Construimos <strong style={{ color: 'var(--eclat-text)' }}>respuestas singulares</strong> frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.
              </p>

              {/* Separador */}
              <div className="mb-5" style={{ height: 1, background: '#b8cec0', maxWidth: 520 }} />

              {/* Tres pilares */}
              <div className="flex gap-0 mb-7" style={{ maxWidth: 520 }}>
                {[
                  { titulo: 'Atención', desc: 'Clínica interdisciplinaria' },
                  { titulo: 'Formación', desc: 'Cursos con fundamento clínico' },
                  { titulo: 'Comunidad', desc: 'Intercambio entre profesionales' },
                ].map((p, i) => (
                  <div
                    key={p.titulo}
                    className="flex-1 px-4"
                    style={{ borderLeft: i > 0 ? '1px solid var(--eclat-border)' : 'none' }}
                  >
                    <p className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--eclat-text)' }}>{p.titulo}</p>
                    <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{p.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <Link
                  href="/formaciones"
                  className="text-[12px] font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
                >
                  Explorar formaciones
                </Link>
                <p className="text-[12px] italic" style={{ color: 'var(--eclat-text-4)' }}>
                  Cada uno encuentra lo suyo.
                </p>
              </div>
            </div>

            {/* ── FORMACIONES EN CURSO ── */}
            {courses && courses.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[14px] font-semibold" style={{ color: 'var(--eclat-text)' }}>
                    Formaciones en curso
                  </h2>
                  <Link href="/formaciones" className="text-[11px] transition-colors hover:opacity-70" style={{ color: 'var(--eclat-mid)' }}>
                    Ver todas →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {courses.map((c, i) => {
                    const colors = ['#4a6658', '#5e8f6e', '#3a5444', '#8fbb9e']
                    return (
                      <Link
                        key={c.id}
                        href={c.id ? `/formaciones/${c.id}` : '/formaciones'}
                        className="bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                        style={{ border: '1px solid var(--eclat-border)' }}
                      >
                        <div style={{ height: 4, background: colors[i % colors.length] }} />
                        <div className="p-4">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--eclat-mid)' }}>
                            {c.badge || 'Formación'}
                          </p>
                          <p className="text-[13px] font-medium mb-1 leading-snug" style={{ color: 'var(--eclat-text)' }}>
                            {c.title}
                          </p>
                          <p className="text-[11px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--eclat-text-3)' }}>
                            {c.description}
                          </p>
                          <div style={{ height: 2, background: 'var(--eclat-border)', borderRadius: 1 }}>
                            <div style={{ width: '0%', height: '100%', background: colors[i % colors.length], borderRadius: 1 }} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── FRASE SEPARADORA ── */}
            <div
              className="mb-7 px-6 py-5 bg-white rounded-xl"
              style={{ borderLeft: '2.5px solid var(--eclat-dark-3)', border: '1px solid var(--eclat-border)', borderLeftWidth: 2.5 }}
            >
              <p
                className="text-[15px] leading-relaxed mb-1"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: 'var(--eclat-text)' }}
              >
                "Cada situación merece una mirada. Cada persona, un tiempo."
              </p>
              <p className="text-[11px]" style={{ color: 'var(--eclat-text-4)' }}>
                — Mirada clínica · Ética profesional · Caso por caso
              </p>
            </div>

            {/* ── ÁREAS DE TRABAJO ── */}
            <div>
              <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--eclat-text)' }}>
                Áreas de trabajo del centro
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AREAS.map(area => (
                  <Link
                    key={area.nombre}
                    href="/servicios"
                    className="bg-white rounded-xl p-4 text-center transition-shadow hover:shadow-sm"
                    style={{ border: '1px solid var(--eclat-border)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2.5 text-[17px]"
                      style={{ background: '#e4efe6' }}
                    >
                      {area.icon}
                    </div>
                    <p className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--eclat-text)' }}>{area.nombre}</p>
                    <p className="text-[10px] leading-snug" style={{ color: 'var(--eclat-text-3)' }}>{area.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div className="w-64 shrink-0">
            <div
              className="rounded-xl p-5 sticky top-[72px]"
              style={{ background: 'var(--eclat-bg-green)', border: '1px solid var(--eclat-border)' }}
            >
              <h3 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--eclat-text)' }}>
                ¿Algo te generó una pregunta?
              </h3>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--eclat-text-2)' }}>
                Construimos respuestas singulares. Si algo de lo que leíste te convocó, el equipo está disponible.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[12px] font-medium py-2.5 rounded-lg mb-2 transition-opacity hover:opacity-80"
                style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
              >
                Escribir al equipo
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[12px] font-medium py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--eclat-border-2)', color: 'var(--eclat-text-2)' }}
              >
                Primera consulta
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
