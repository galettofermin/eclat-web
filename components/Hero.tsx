'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'

interface HeroProps {
  siteConfig?: Record<string, string>
  featuredCourse?: Course | null
  courses?: Course[]
}

// Fade-up escalonado al cargar — sin loops
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay },
})

const cardBgs = ['#DCEFE8', '#E8F4F0', '#F0FAF5', '#E4F2EC']

const institutionalCards = [
  {
    title: 'Atención clínica',
    desc: 'Psicología, psicopedagogía, fonoaudiología y psicomotricidad.',
    href: '/servicios',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <circle cx="15" cy="18" r="7" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="25" cy="18" r="7" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M20 12c0 3.3-2.7 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
        <path d="M20 24c2 2.5 5 3.5 8 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
      </svg>
    ),
  },
  {
    title: 'Inclusión educativa',
    desc: 'Acompañamiento de trayectorias escolares, DAI, PPI y articulación con escuelas.',
    href: '/servicios',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path d="M8 32 Q14 20 20 16 Q26 12 32 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="20" cy="16" r="3" fill="currentColor" opacity=".3"/>
        <circle cx="32" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 32 Q10 28 14 27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".5"/>
      </svg>
    ),
  },
  {
    title: 'Formación',
    desc: 'Cursos, seminarios, diplomaturas y propuestas para profesionales, docentes y familias.',
    href: '/formacion',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <rect x="8" y="12" width="18" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 18h10M14 22h10M14 26h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M26 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Producción institucional',
    desc: 'Escritos, publicaciones, investigación y herramientas para los desafíos actuales.',
    href: '/escritos',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path d="M10 34 L10 8 Q10 6 12 6 L28 6 Q30 6 30 8 L30 34" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6 34h28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16 14h8M14 19h12M14 24h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".6"/>
        <circle cx="20" cy="30" r="1.5" fill="currentColor" opacity=".4"/>
      </svg>
    ),
  },
]

export default function Hero({ siteConfig: initialConfig }: HeroProps) {
  const [config, setConfig] = useState(initialConfig ?? {})
  const isDirector = useDirector()
  const [editing, setEditing] = useState(false)

  const subtitle = config.hero_subtitle ?? 'Un espacio donde cada persona es escuchada en su singularidad. Acompañamos el desarrollo de niños, adolescentes y adultos.'
  const teamImage = config.hero_team_image ?? ''

  const editFields: EditField[] = [
    { key: 'hero_subtitle',    label: 'Subtítulo',      type: 'textarea', rows: 3, value: subtitle },
    { key: 'hero_team_image',  label: 'Foto del equipo (URL)', type: 'image', value: teamImage, hint: 'Subí la foto del equipo para la columna derecha' },
  ]

  const saveConfig = async (data: Record<string, string>) => {
    const supabase = createClient()
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        supabase.from('site_config').upsert({ key, value, updated_at: new Date().toISOString() })
      )
    )
    setConfig(c => ({ ...c, ...data }))
  }

  return (
    <>
      {/* ══ HERO ══ */}
      <section
        id="inicio"
        className="relative overflow-hidden"
        style={{ background: '#FAF8F2' }}
      >
        {isDirector && (
          <div className="absolute top-20 right-5 z-20">
            <EditBtn onClick={() => setEditing(true)} label="Editar hero" variant="section" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center min-h-screen pt-24 pb-16">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div>

            {/* Tag institucional */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-10">
              <div style={{ width: 24, height: 1, background: '#2F7D6B', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: '#2F7D6B',
                fontWeight: 500,
              }}>
                Centro de Atención Integral · Rosario
              </span>
            </motion.div>

            {/* Título en Cormorant */}
            <motion.h1
              {...fadeUp(0.1)}
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#1B2B26',
              }}
            >
              Cuerpo, voz
              <br />
              y palabra.
              <br />
              <em style={{ color: '#2F7D6B', fontStyle: 'italic' }}>
                Un lugar para cada uno.
              </em>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              {...fadeUp(0.2)}
              style={{
                fontSize: '1rem',
                fontWeight: 300,
                color: '#4B6B5E',
                lineHeight: 1.8,
                maxWidth: 420,
                marginTop: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {subtitle}
            </motion.p>

            {/* Botones */}
            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{
                  background: '#2F7D6B',
                  color: 'white',
                  padding: '0.85rem 2rem',
                  borderRadius: 4,
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Reservar turno
              </a>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center hover:bg-[#F0F7F4] transition-colors"
                style={{
                  background: 'transparent',
                  color: '#2F7D6B',
                  border: '1px solid #2F7D6B',
                  padding: '0.85rem 2rem',
                  borderRadius: 4,
                  fontSize: '0.88rem',
                  fontWeight: 500,
                }}
              >
                Conocer servicios
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.p
              {...fadeUp(0.4)}
              style={{ fontSize: '0.78rem', color: '#4B6B5E', letterSpacing: '0.02em' }}
            >
              8 especialidades · Atención interdisciplinaria · Rosario
            </motion.p>

          </div>

          {/* ── COLUMNA DERECHA — imagen o placeholder ── */}
          <motion.div {...fadeUp(0.15)} className="hidden lg:block">
            {teamImage ? (
              <div
                style={{
                  height: 520,
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={teamImage}
                  alt="Equipo ÉCLAT"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-3"
                style={{
                  height: 520,
                  background: '#DCEFE8',
                  borderRadius: 4,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1" opacity={0.4}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span style={{ fontSize: '0.78rem', color: '#2F7D6B', opacity: 0.45, fontFamily: 'monospace' }}>
                  /* Foto del equipo */
                </span>
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* ══ CUATRO TARJETAS INSTITUCIONALES ══ */}
      <section className="py-16 md:py-24 px-5 bg-white border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionalCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 24, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link
                  href={card.href}
                  style={{ backgroundColor: cardBgs[i] }}
                  className="group block rounded-2xl md:rounded-3xl p-6 border border-transparent hover:border-[#2F7D6B]/25 shadow-sm hover:shadow-xl hover:shadow-[#2F7D6B]/12 transition-all duration-300 h-full relative overflow-hidden"
                >
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F7D6B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-14 h-14 rounded-2xl bg-white/70 shadow-sm mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <div className="w-8 h-8 text-[#2F7D6B]">{card.icon}</div>
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-2 group-hover:text-[#2F7D6B] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-[#6E6E73] leading-relaxed">{card.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#2F7D6B] opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit drawer */}
      <EditDrawer
        isOpen={editing}
        title="Editar Hero"
        fields={editFields}
        onSave={saveConfig}
        onClose={() => setEditing(false)}
      />
    </>
  )
}
