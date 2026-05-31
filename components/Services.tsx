'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Service } from '@/lib/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  'Psicología': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3L9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3L14.5 2Z" /></svg>),
  'Psicopedagogía': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>),
  'Fonoaudiología': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>),
  'Psicomotricidad': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="2" /><path d="M12 7v6" /><path d="m9 10-2 4" /><path d="m15 10 2 4" /><path d="m9 20 3-3 3 3" /></svg>),
  'Arteterapia': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>),
  'Docente de Apoyo': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
  'Taller de Habilidades Sociales': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>),
  'Evaluaciones Diagnósticas': (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>),
}

const FALLBACK_ICON = (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>)

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

function ServiceCard({ service, index }: { service: Omit<Service, 'id'> & { id?: string }; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white border border-black/[0.07] rounded-2xl p-7 flex flex-col gap-4 overflow-hidden transition-shadow hover:shadow-lg hover:shadow-black/5"
    >
      <motion.div
        animate={hovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-12 h-12 rounded-xl bg-[#DCEFE8] flex items-center justify-center text-[#2F7D6B]"
      >
        {ICON_MAP[service.title] ?? FALLBACK_ICON}
      </motion.div>
      <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{service.title}</h3>
      <p className="text-[14px] text-[#6E6E73] leading-relaxed">{service.description}</p>
      <motion.div
        animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F7D6B] origin-left"
      />
    </motion.div>
  )
}

interface ServicesProps {
  services?: Service[]
  siteConfig?: Record<string, string>
}

export default function Services({ services, siteConfig }: ServicesProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const data = services ?? DEFAULT_SERVICES
  const title = siteConfig?.services_title ?? 'Lo que hacemos.'
  const subtitle = siteConfig?.services_subtitle ?? 'Un equipo interdisciplinario para acompañar el desarrollo, el aprendizaje y la salud mental en cada etapa de la vida.'

  return (
    <section id="servicios" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={ref}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-[#2F7D6B] text-[13px] font-semibold tracking-widest uppercase mb-4">Servicios</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight mb-4 max-w-2xl">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="text-[17px] text-[#6E6E73] mb-16 max-w-xl">{subtitle}</motion.p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((service, i) => (
            <ServiceCard key={(service as Service).id ?? service.title} service={service} index={i} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="mt-14 text-center">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] px-8 py-3.5 rounded-full hover:bg-[#245f52] transition-colors shadow-md shadow-[#2F7D6B]/20">
            Consultar por turno →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
