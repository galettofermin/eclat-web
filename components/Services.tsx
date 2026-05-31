'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Service } from '@/lib/types'

/* ── Ilustraciones únicas por servicio ── */
const illustrations = {
  'Psicología': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="32" cy="22" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M26 20c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.5-1.5 4.6-3.7 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="22" r="3" fill="currentColor" opacity=".3"/>
      <path d="M20 44c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M29 36l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Psicopedagogía': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <rect x="12" y="18" width="28" height="34" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 28h28" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M18 23h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 34h16M18 39h12M18 44h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="46" cy="22" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M44 22l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M46 30v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Fonoaudiología': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <rect x="24" y="8" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 30c0 8.8 7.2 16 16 16s16-7.2 16-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="46" x2="32" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="54" x2="40" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 28c2-2 4-2 4 0s2 2 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M48 28c2-2 4-2 4 0s2 2 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Psicomotricidad': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="32" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M32 18v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 24l-10 8M32 24l10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 32l-6 14M42 32l6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 46l4-6M48 46l-4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="14" cy="28" r="2" fill="currentColor" opacity=".4"/>
      <circle cx="50" cy="28" r="2" fill="currentColor" opacity=".4"/>
    </svg>
  ),
  'Arteterapia': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2"/>
      <circle cx="22" cy="26" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="42" cy="26" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="22" cy="42" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="42" cy="42" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="32" cy="32" r="4" fill="currentColor" opacity=".3"/>
      <path d="M26 32c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Docente de Apoyo': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="22" cy="18" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 48c0-7.7 6.3-14 14-14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="44" cy="26" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M34 48c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 28l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 24v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Taller de Habilidades Sociales': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="14" cy="36" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="50" cy="36" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M26 18l-8 12M38 18l8 12M20 42l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 48v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'Evaluaciones Diagnósticas': (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <rect x="14" y="10" width="36" height="44" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 10v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 26l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 38h20M22 44h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="46" cy="44" r="8" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M43 44l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const cards = [
  { key: 'Psicología', dark: true },
  { key: 'Psicopedagogía', dark: false },
  { key: 'Fonoaudiología', dark: false },
  { key: 'Psicomotricidad', dark: true },
  { key: 'Arteterapia', dark: true },
  { key: 'Docente de Apoyo', dark: false },
  { key: 'Taller de Habilidades Sociales', dark: false },
  { key: 'Evaluaciones Diagnósticas', dark: true },
]

const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { title: 'Psicología', description: 'Evaluación, diagnóstico y acompañamiento terapéutico para niños, adolescentes y adultos.', sort_order: 1, published: true },
  { title: 'Psicopedagogía', description: 'Abordaje de las dificultades de aprendizaje con estrategias adaptadas a cada estudiante.', sort_order: 2, published: true },
  { title: 'Fonoaudiología', description: 'Tratamiento del lenguaje, la comunicación, la voz, la deglución y la audición.', sort_order: 3, published: true },
  { title: 'Psicomotricidad', description: 'Desarrollo motor y emocional a través del movimiento y el juego.', sort_order: 4, published: true },
  { title: 'Arteterapia', description: 'El proceso creativo como medio de expresión, autoconocimiento y crecimiento personal.', sort_order: 5, published: true },
  { title: 'Docente de Apoyo', description: 'Acompañamiento en trayectorias educativas en colaboración con familias e instituciones.', sort_order: 6, published: true },
  { title: 'Taller de Habilidades Sociales', description: 'Espacios grupales semanales con enfoque interdisciplinario para niños y adolescentes.', sort_order: 7, published: true },
  { title: 'Evaluaciones Diagnósticas', description: 'Evaluaciones integrales para orientar el plan terapéutico de cada persona.', sort_order: 8, published: true },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
}

interface ServicesProps {
  services?: Service[]
  siteConfig?: Record<string, string>
}

export default function Services({ services, siteConfig }: ServicesProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const data = services ?? DEFAULT_SERVICES

  const title = siteConfig?.services_title ?? 'Lo que hacemos.'
  const subtitle = siteConfig?.services_subtitle ?? 'Un equipo interdisciplinario para acompañar el desarrollo, el aprendizaje y la salud mental en cada etapa de la vida.'

  return (
    <section id="servicios" className="py-24 md:py-32 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={ref} className="mb-14 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#2F7D6B] text-[12px] font-semibold tracking-[0.2em] uppercase mb-4"
          >
            Servicios
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.05] max-w-xl"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[16px] text-[#6E6E73] max-w-sm leading-relaxed md:text-right"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        {/* Grid de servicios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {data.map((service, i) => {
            const cardInfo = cards.find(c => c.key === service.title) ?? cards[i % cards.length]
            const illustration = illustrations[service.title as keyof typeof illustrations]
            const isDark = cardInfo.dark

            return (
              <motion.div
                key={(service as Service).id ?? service.title}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`relative rounded-2xl md:rounded-3xl p-5 md:p-7 flex flex-col gap-4 overflow-hidden cursor-default ${
                  isDark
                    ? 'bg-[#1e5c50] text-white'
                    : 'bg-[#F5F5F7] text-[#0A0A0A]'
                }`}
              >
                {/* Fondo sutil */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle at 80% 20%, rgba(100,200,170,0.3) 0%, transparent 60%)'
                      : 'radial-gradient(circle at 20% 80%, rgba(47,125,107,0.08) 0%, transparent 60%)',
                  }}
                />

                {/* Ilustración */}
                <div className={`relative w-12 h-12 md:w-14 md:h-14 ${isDark ? 'text-white/80' : 'text-[#2F7D6B]'}`}>
                  {illustration}
                </div>

                {/* Texto */}
                <div className="relative flex-1 flex flex-col gap-2">
                  <h3 className={`text-[14px] md:text-[16px] font-semibold leading-snug ${isDark ? 'text-white' : 'text-[#0A0A0A]'}`}>
                    {service.title}
                  </h3>
                  <p className={`text-[12px] md:text-[13px] leading-relaxed ${isDark ? 'text-white/65' : 'text-[#6E6E73]'}`}>
                    {service.description}
                  </p>
                </div>

                {/* Flecha */}
                <div className={`relative w-7 h-7 rounded-full flex items-center justify-center self-end ${
                  isDark ? 'bg-white/15' : 'bg-[#2F7D6B]/10'
                }`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'white' : '#2F7D6B'} strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#F5F5F7] rounded-2xl md:rounded-3xl px-7 py-6"
        >
          <div>
            <p className="text-[17px] font-semibold text-[#0A0A0A]">¿No sabés por dónde empezar?</p>
            <p className="text-[14px] text-[#6E6E73] mt-0.5">Escribinos y te orientamos sin compromiso.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[14px] hover:bg-[#245f52] transition-colors shadow-lg shadow-[#2F7D6B]/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            Consultar ahora
          </a>
        </motion.div>
      </div>
    </section>
  )
}
