'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'

interface HeroProps {
  siteConfig?: Record<string, string>
  featuredCourse?: Course | null
  courses?: Course[]
}

const SERVICES = [
  'Psicología',
  'Psicopedagogía',
  'Fonoaudiología',
  'Psicomotricidad',
  'Docente de Apoyo',
  'Acompañante Terapéutico',
  'Arteterapia',
  'Habilidades Sociales',
  'Evaluaciones Diagnósticas',
]

const keywords = ['Clínica', 'Educación', 'Formación', 'Instituciones', 'Trayectorias', 'Comunidad']

const cardBgs = ['#DCEFE8', '#E8F4F0', '#F0FAF5', '#E4F2EC']

// Animación sincronizada: bar + clip-path del texto, 6s loop
const SWEEP = {
  animate: {
    clipPath: [
      'inset(0 100% 0 0)',
      'inset(0 0% 0 0)',
      'inset(0 0% 0 100%)',
      'inset(0 100% 0 0)',
    ],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    times: [0, 0.5, 0.95, 1],
  },
}

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

// Texto pintado — capa base + capa coloreada sincronizada con la barra
function PaintText({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={`relative inline-block ${className ?? ''}`} style={style}>
      {/* Base — verde muy oscuro */}
      <span style={{ color: '#1B2B26' }}>{children}</span>
      {/* Revelado — verde ÉCLAT, sigue la barra */}
      <motion.span
        className="absolute inset-0 overflow-hidden"
        style={{ color: '#2F7D6B', zIndex: 6 }}
        {...SWEEP}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero({ siteConfig: initialConfig }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [activeIdx, setActiveIdx] = useState(0)
  const [config, setConfig] = useState(initialConfig ?? {})
  const isDirector = useDirector()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % SERVICES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const subtitle = config.hero_subtitle ?? 'Acompañamos a personas, familias, profesionales e instituciones a través de la clínica, la educación, la formación y el trabajo interdisciplinario.'
  const brief    = config.hero_brief    ?? 'Creemos en el valor de la escucha, el encuentro y la construcción conjunta de respuestas frente a los desafíos de cada trayectoria.'

  const editFields: EditField[] = [
    { key: 'hero_subtitle', label: 'Subtítulo',   type: 'textarea', rows: 3, value: subtitle },
    { key: 'hero_brief',    label: 'Texto breve', type: 'textarea', rows: 3, value: brief    },
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
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 pt-16 bg-white"
      >
        {/* Rastro verde — fondo que avanza con la barra */}
        <motion.div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #DCEFE8 0%, #F0F7F4 100%)',
            zIndex: 1,
          }}
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }}
        />

        {/* Barra vertical luminosa */}
        <motion.div
          className="absolute top-0 pointer-events-none"
          style={{
            width: 3,
            height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, #2F7D6B 20%, #2F7D6B 80%, transparent 100%)',
            boxShadow: '0 0 20px rgba(47,125,107,0.4), 0 0 60px rgba(47,125,107,0.2)',
            zIndex: 5,
          }}
          animate={{ x: ['-5vw', '105vw', '-5vw'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }}
        />

        {/* Contenido del hero */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto w-full"
        >
          {isDirector && (
            <div className="absolute -top-8 right-0 z-20">
              <EditBtn onClick={() => setEditing(true)} label="Editar hero" variant="section" />
            </div>
          )}

          <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center" style={{ zIndex: 10, position: 'relative' }}>

            {/* ── COLUMNA IZQUIERDA ── */}
            <div style={{ zIndex: 10, position: 'relative' }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#2F7D6B] mb-8 tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6B] animate-pulse" />
                ÉCLAT — Institución interdisciplinaria
              </motion.div>

              {/* Título — 3 líneas con efecto pintura */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.6rem,6.5vw,4.4rem)' }}
              >
                <span className="block">
                  <PaintText style={{ fontWeight: 800 }}>Cuerpo, voz</PaintText>
                </span>
                <span className="block">
                  <PaintText style={{ fontWeight: 800 }}>y palabra.</PaintText>
                </span>
                <span className="block mt-1">
                  <PaintText style={{ fontWeight: 300, fontSize: '0.85em' }}>Un lugar para cada uno.</PaintText>
                </span>
              </motion.h1>

              {/* Subtítulo con efecto pintura */}
              <motion.div
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-[17px] md:text-[18px] leading-relaxed mb-4 max-w-xl font-light"
              >
                <PaintText>{subtitle}</PaintText>
              </motion.div>

              {/* Texto breve */}
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36 }}
                className="text-[14px] leading-relaxed mb-10 max-w-lg"
                style={{ color: 'rgba(75,107,94,0.7)' }}
              >
                {brief}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44 }}
                className="flex flex-col sm:flex-row gap-3 mb-12"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link href="/formacion"
                    className="inline-flex items-center justify-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] px-7 py-3.5 rounded-full shadow-lg shadow-[#2F7D6B]/30 hover:bg-[#245f52] transition-colors w-full sm:w-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                    Explorá nuestras formaciones
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link href="/servicios"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#2F7D6B] font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#F0F7F4] transition-colors w-full sm:w-auto"
                    style={{ border: '1.5px solid #2F7D6B' }}>
                    Conocé nuestros servicios
                  </Link>
                </motion.div>
              </motion.div>

              {/* Keyword chips */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-2"
              >
                {keywords.map((word, i) => (
                  <motion.span
                    key={word}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className="text-[12px] font-medium text-[#4B6B5E] bg-white border border-[#2F7D6B]/15 px-3 py-1.5 rounded-full cursor-default shadow-sm"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* ── COLUMNA DERECHA: Lista animada de servicios ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col gap-1.5 py-4"
              style={{ zIndex: 10, position: 'relative' }}
            >
              {SERVICES.map((service, i) => {
                const isActive = i === activeIdx
                return (
                  <div key={service} className="flex items-center gap-3 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isActive ? (
                        <motion.span
                          key="tri"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0 select-none leading-none"
                          style={{ color: '#2F7D6B', fontSize: 14 }}
                        >
                          ▶
                        </motion.span>
                      ) : (
                        <motion.span
                          key="gap"
                          style={{ width: 20, display: 'inline-block', flexShrink: 0 }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.span
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        fontSize: isActive ? 'clamp(1.3rem, 2.2vw, 1.8rem)' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#1B2B26' : 'rgba(27,43,38,0.3)',
                        lineHeight: 1.25,
                        transition: 'font-size 0.4s ease',
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      {service}
                    </motion.span>
                  </div>
                )
              })}
            </motion.div>

          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ zIndex: 10 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-[#2F7D6B]/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#2F7D6B]/40" />
          </motion.div>
        </motion.div>
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
