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

const PARTICLES = [
  { x: '5%',  y: '15%', size: 4, color: 'rgba(47,125,107,0.35)',  dur: 6,  delay: 0,   dy: -30, dx: 15  },
  { x: '15%', y: '70%', size: 3, color: 'rgba(183,216,204,0.6)',  dur: 8,  delay: 1,   dy: 20,  dx: -10 },
  { x: '25%', y: '40%', size: 5, color: 'rgba(47,125,107,0.35)',  dur: 5,  delay: 2,   dy: -25, dx: 10  },
  { x: '35%', y: '85%', size: 3, color: 'rgba(183,216,204,0.6)',  dur: 9,  delay: 0.5, dy: -20, dx: -15 },
  { x: '45%', y: '20%', size: 6, color: 'rgba(47,125,107,0.35)',  dur: 7,  delay: 3,   dy: 30,  dx: 12  },
  { x: '55%', y: '60%', size: 4, color: 'rgba(183,216,204,0.6)',  dur: 6,  delay: 1.5, dy: -18, dx: -8  },
  { x: '65%', y: '30%', size: 3, color: 'rgba(47,125,107,0.35)',  dur: 10, delay: 4,   dy: 25,  dx: 15  },
  { x: '75%', y: '75%', size: 5, color: 'rgba(183,216,204,0.6)',  dur: 8,  delay: 2,   dy: -30, dx: -12 },
  { x: '85%', y: '45%', size: 4, color: 'rgba(47,125,107,0.35)',  dur: 5,  delay: 0.8, dy: 20,  dx: 10  },
  { x: '92%', y: '10%', size: 3, color: 'rgba(183,216,204,0.6)',  dur: 9,  delay: 3.5, dy: -25, dx: -10 },
  { x: '10%', y: '90%', size: 6, color: 'rgba(47,125,107,0.35)',  dur: 7,  delay: 1.2, dy: -20, dx: 18  },
  { x: '30%', y: '55%', size: 3, color: 'rgba(183,216,204,0.6)',  dur: 6,  delay: 4.5, dy: 15,  dx: -8  },
  { x: '50%', y: '80%', size: 5, color: 'rgba(47,125,107,0.35)',  dur: 8,  delay: 2.8, dy: -28, dx: 12  },
  { x: '70%', y: '15%', size: 4, color: 'rgba(183,216,204,0.6)',  dur: 5,  delay: 0.3, dy: 22,  dx: -14 },
  { x: '88%', y: '65%', size: 3, color: 'rgba(47,125,107,0.35)',  dur: 9,  delay: 3.2, dy: -15, dx: 8   },
]

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
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [activeIdx, setActiveIdx] = useState(0)
  const [config, setConfig] = useState(initialConfig ?? {})
  const isDirector = useDirector()
  const [editing, setEditing] = useState(false)

  // Rotación automática de servicios
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % SERVICES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const title    = config.hero_title    ?? 'Cuerpo, voz y palabra.'
  const subtitle = config.hero_subtitle ?? 'Acompañamos a personas, familias, profesionales e instituciones a través de la clínica, la educación, la formación y el trabajo interdisciplinario.'
  const brief    = config.hero_brief    ?? 'Creemos en el valor de la escucha, el encuentro y la construcción conjunta de respuestas frente a los desafíos de cada trayectoria.'

  const editFields: EditField[] = [
    { key: 'hero_title',    label: 'Título principal', type: 'text',     value: title    },
    { key: 'hero_subtitle', label: 'Subtítulo',        type: 'textarea', rows: 3, value: subtitle },
    { key: 'hero_brief',    label: 'Texto breve',      type: 'textarea', rows: 3, value: brief    },
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
        className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 pt-16"
        style={{ background: 'linear-gradient(135deg, #F0F7F4 0%, #E8F2EE 40%, #F2F4F3 70%, #EAEFF0 100%)' }}
      >
        {/* Dot grid sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(47,125,107,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
            zIndex: 0,
          }}
        />

        {/* Trazo orgánico 1 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1, overflow: 'visible' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M -100 300 Q 200 100 500 400 Q 700 600 1000 200 Q 1200 50 1500 350"
            stroke="rgba(47,125,107,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
          />
        </svg>

        {/* Trazo orgánico 2 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1, overflow: 'visible' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 1600 100 Q 1200 300 900 150 Q 600 0 300 250 Q 100 400 -100 200"
            stroke="rgba(183,216,204,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </svg>

        {/* Blob 1 — grande, arriba derecha */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 600, height: 600,
            top: -200, right: -100,
            background: 'radial-gradient(circle, rgba(47,125,107,0.12) 0%, transparent 70%)',
            borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
            zIndex: 1,
          }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, 0],
            borderRadius: [
              '60% 40% 70% 30% / 50% 60% 40% 50%',
              '40% 60% 30% 70% / 60% 40% 50% 60%',
              '60% 40% 70% 30% / 50% 60% 40% 50%',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Blob 2 — mediano, abajo izquierda */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 400, height: 400,
            bottom: -100, left: -50,
            background: 'radial-gradient(circle, rgba(183,216,204,0.25) 0%, transparent 70%)',
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Blob 3 — pequeño, centro flotante */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 300, height: 300,
            top: '40%', left: '40%',
            background: 'radial-gradient(circle, rgba(47,125,107,0.08) 0%, transparent 70%)',
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Partículas flotantes */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: p.x, top: p.y,
              width: p.size, height: p.size,
              background: p.color,
              zIndex: 1,
            }}
            animate={{
              y: [0, p.dy, 0],
              x: [0, p.dx, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}


        {/* Gradiente que respira */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: '120%', height: '120%',
            top: '-10%', left: '-10%',
            background: 'radial-gradient(ellipse at 30% 50%, rgba(47,125,107,0.12) 0%, transparent 60%)',
            zIndex: 1,
          }}
          animate={{ x: ['0%', '40%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Glow central */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 800, height: 400,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(47,125,107,0.1) 0%, transparent 70%)',
            zIndex: 1,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Overlay inferior — fusión suave con la sección siguiente */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 60%, rgba(240,247,244,0.9) 100%)',
            zIndex: 2,
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto w-full"
        >
          {isDirector && (
            <div className="absolute -top-8 right-0">
              <EditBtn onClick={() => setEditing(true)} label="Editar hero" variant="section" />
            </div>
          )}

          <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-12 items-center">

            {/* ── COLUMNA IZQUIERDA ── */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#2F7D6B] mb-8 tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6B] animate-pulse" />
                ÉCLAT — Institución interdisciplinaria
              </motion.div>

              {/* Título */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.6rem,6.5vw,4.4rem)] leading-[1.04] tracking-tight mb-6"
              >
                <span className="block" style={{ fontWeight: 800, color: '#0A1F1A' }}>
                  {title}
                </span>
                <span className="block" style={{ fontWeight: 300, color: '#4B6B5E' }}>
                  Un lugar para cada uno.
                </span>
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-[17px] md:text-[18px] leading-relaxed mb-4 max-w-xl font-light" style={{ color: '#4B6B5E' }}
              >
                {subtitle}
              </motion.p>

              {/* Texto breve */}
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36 }}
                className="text-[14px] leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(75,107,94,0.7)' }}
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
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#2F7D6B] font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#F0F7F4] transition-colors w-full sm:w-auto" style={{ border: '1.5px solid #2F7D6B' }}>
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
                    className="text-[12px] font-medium text-[#4B6B5E] bg-white/70 border border-[#2F7D6B]/15 px-3 py-1.5 rounded-full cursor-default"
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
            >
              {SERVICES.map((service, i) => {
                const isActive = i === activeIdx
                return (
                  <div key={service} className="flex items-center gap-3 overflow-hidden">
                    {/* Triángulo / espaciador */}
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

                    {/* Texto del servicio */}
                    <motion.span
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        fontSize: isActive
                          ? 'clamp(1.3rem, 2.2vw, 1.8rem)'
                          : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#0A1F1A' : 'rgba(10,31,26,0.3)',
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
