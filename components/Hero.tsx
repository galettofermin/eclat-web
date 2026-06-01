'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/lib/types'
import HeroBg from './HeroBg'

interface HeroProps {
  siteConfig?: Record<string, string>
  featuredCourse?: Course | null
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

const keywords = ['Clínica', 'Educación', 'Formación', 'Instituciones', 'Trayectorias', 'Comunidad']

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

export default function Hero({ siteConfig: initialConfig, featuredCourse }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [config, setConfig] = useState(initialConfig ?? {})
  const isDirector = useDirector()
  const [editing, setEditing] = useState(false)

  // Parallax del cursor — solo desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return
    const handle = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const title = config.hero_title ?? 'Un espacio para construir posibilidades.'
  const subtitle = config.hero_subtitle ?? 'Acompañamos a personas, familias, profesionales e instituciones a través de la clínica, la educación, la formación y el trabajo interdisciplinario.'
  const brief = config.hero_brief ?? 'Creemos en el valor de la escucha, el encuentro y la construcción conjunta de respuestas frente a los desafíos de cada trayectoria.'

  const editFields: EditField[] = [
    { key: 'hero_title', label: 'Título principal', type: 'text', value: title },
    { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 3, value: subtitle },
    { key: 'hero_brief', label: 'Texto breve', type: 'textarea', rows: 3, value: brief },
  ]

  const saveConfig = async (data: Record<string, string>) => {
    const supabase = createClient()
    await Promise.all(Object.entries(data).map(([key, value]) =>
      supabase.from('site_config').upsert({ key, value, updated_at: new Date().toISOString() })
    ))
    setConfig(c => ({ ...c, ...data }))
  }

  return (
    <>
      {/* ══ HERO ══ */}
      <section
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#FAFAF8] px-5 pt-16"
      >
        {/* Fondo abstracto animado — canvas con blobs de color ÉCLAT */}
        <HeroBg opacity={0.6} />

        {/* Capa parallax cursor encima del canvas */}
        <div className="absolute pointer-events-none inset-0 overflow-hidden">
          <div style={{
            position: 'absolute', top: '10%', right: '5%',
            width: '35vw', height: '35vw', maxWidth: 500, maxHeight: 500,
            background: 'radial-gradient(ellipse, rgba(47,125,107,0.08) 0%, transparent 70%)',
            transform: `translate(${mouse.x * -25}px, ${mouse.y * -18}px)`,
            transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '5%',
            width: '25vw', height: '25vw', maxWidth: 360, maxHeight: 360,
            background: 'radial-gradient(ellipse, rgba(220,239,232,0.4) 0%, transparent 70%)',
            transform: `translate(${mouse.x * 18}px, ${mouse.y * 14}px)`,
            transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto w-full"
        >
          {isDirector && (
            <div className="absolute -top-8 right-0">
              <EditBtn onClick={() => setEditing(true)} label="Editar hero" variant="section" />
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center">

            {/* ── CONTENIDO IZQUIERDO ── */}
            <div>
              {/* Badge institucional */}
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
                className="text-[clamp(2.6rem,6.5vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#0A0A0A] mb-6"
              >
                {title}
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="text-[17px] md:text-[18px] text-[#424245] leading-relaxed mb-4 max-w-xl font-light"
              >
                {subtitle}
              </motion.p>

              {/* Texto breve */}
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36 }}
                className="text-[14px] text-[#86868b] leading-relaxed mb-10 max-w-lg"
              >
                {brief}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.44 }}
                className="flex flex-col sm:flex-row gap-3 mb-12"
              >
                {/* Primario — Formaciones */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link href="/formacion"
                    className="inline-flex items-center justify-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] px-7 py-3.5 rounded-full shadow-lg shadow-[#2F7D6B]/25 hover:bg-[#245f52] transition-colors w-full sm:w-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                    Explorá nuestras formaciones
                  </Link>
                </motion.div>

                {/* Secundario — Servicios */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link href="/servicios"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0A0A0A] border border-black/10 font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#F5F5F7] transition-colors w-full sm:w-auto">
                    Conocé nuestros servicios
                  </Link>
                </motion.div>
              </motion.div>

              {/* Keyword chips flotantes */}
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
                    className="text-[12px] font-medium text-[#6E6E73] bg-white border border-black/[0.07] px-3 py-1.5 rounded-full shadow-sm cursor-default"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* ── TARJETA DE CURSO DESTACADO ── */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  transform: `perspective(1000px) rotateY(${mouse.x * -4}deg) rotateX(${mouse.y * 3}deg)`,
                  transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {featuredCourse ? (
                  <div className="bg-white rounded-3xl shadow-2xl shadow-[#2F7D6B]/10 border border-black/[0.06] overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]" />
                    <div className="p-7">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F7D6B] bg-[#DCEFE8] px-2.5 py-1 rounded-full">
                          Curso destacado
                        </span>
                      </div>
                      <h3 className="text-[20px] font-bold text-[#0A0A0A] mb-2 leading-tight">
                        {featuredCourse.title}
                      </h3>
                      <p className="text-[13px] text-[#6E6E73] leading-relaxed mb-6">
                        {featuredCourse.description}
                      </p>
                      <div className="mb-5">
                        {featuredCourse.price_original > featuredCourse.price && (
                          <p className="text-[14px] text-[#86868b] line-through">{formatPrice(featuredCourse.price_original)}</p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <p className="text-[28px] font-bold text-[#0A0A0A]">{formatPrice(featuredCourse.price)}</p>
                          {featuredCourse.price_original > featuredCourse.price && (
                            <span className="text-[12px] font-bold text-white bg-[#2F7D6B] px-2 py-0.5 rounded-full">
                              -{Math.round(((featuredCourse.price_original - featuredCourse.price) / featuredCourse.price_original) * 100)}%
                            </span>
                          )}
                        </div>
                        {featuredCourse.is_free && (
                          <p className="text-[22px] font-bold text-[#2F7D6B]">Gratuito</p>
                        )}
                      </div>
                      <Link href={`/cursos/${featuredCourse.id}`}
                        className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-2xl hover:bg-[#245f52] transition-colors text-[15px] shadow-lg shadow-[#2F7D6B]/20">
                        Ver curso →
                      </Link>
                      <div className="mt-4 flex items-center gap-3 justify-center">
                        {featuredCourse.duration && (
                          <span className="text-[11px] text-[#86868b] flex items-center gap-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            {featuredCourse.duration}
                          </span>
                        )}
                        {featuredCourse.level && (
                          <span className="text-[11px] text-[#86868b]">· {featuredCourse.level}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Placeholder si no hay curso */
                  <div className="bg-white rounded-3xl shadow-2xl shadow-[#2F7D6B]/10 border border-black/[0.06] overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]" />
                    <div className="p-7">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2F7D6B] bg-[#DCEFE8] px-2.5 py-1 rounded-full">Próximamente</span>
                      <h3 className="text-[20px] font-bold text-[#0A0A0A] mt-4 mb-2">Nuevas formaciones</h3>
                      <p className="text-[13px] text-[#6E6E73] mb-6">Cursos y diplomaturas para profesionales, docentes y familias.</p>
                      <Link href="/formacion"
                        className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-2xl hover:bg-[#245f52] transition-colors text-[15px]">
                        Ver formaciones →
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Tarjeta de curso mobile */}
            {featuredCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="lg:hidden bg-white rounded-2xl border border-black/[0.06] shadow-lg overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]" />
                <div className="p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#2F7D6B] mb-1">Curso destacado</p>
                    <p className="text-[15px] font-bold text-[#0A0A0A] truncate">{featuredCourse.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      {featuredCourse.price_original > featuredCourse.price && (
                        <span className="text-[12px] text-[#86868b] line-through">{formatPrice(featuredCourse.price_original)}</span>
                      )}
                      <span className="text-[18px] font-bold text-[#0A0A0A]">
                        {featuredCourse.is_free ? 'Gratis' : formatPrice(featuredCourse.price)}
                      </span>
                    </div>
                  </div>
                  <Link href={`/cursos/${featuredCourse.id}`}
                    className="shrink-0 bg-[#2F7D6B] text-white font-semibold text-[13px] px-4 py-2.5 rounded-full hover:bg-[#245f52] transition-colors">
                    Ver →
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-black/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-black/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CUATRO TARJETAS INSTITUCIONALES ══ */}
      <section className="py-16 md:py-24 px-5 bg-[#FAFAF8] border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionalCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 260, damping: 24, delay: i * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link href={card.href}
                  className="group block bg-white rounded-2xl md:rounded-3xl p-6 border border-black/[0.06] shadow-sm hover:shadow-lg hover:shadow-[#2F7D6B]/8 hover:border-[#2F7D6B]/20 transition-all h-full relative overflow-hidden">
                  {/* Accent line animada */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F7D6B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

                  <div className="w-11 h-11 text-[#2F7D6B] mb-5 transition-transform duration-300 group-hover:scale-110">
                    {card.icon}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-2 group-hover:text-[#2F7D6B] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                    {card.desc}
                  </p>
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
      <EditDrawer isOpen={editing} title="Editar Hero" fields={editFields} onSave={saveConfig} onClose={() => setEditing(false)} />
    </>
  )
}
