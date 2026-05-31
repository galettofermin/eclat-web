'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'

const spring = { type: 'spring', stiffness: 260, damping: 24 }

const DEFAULT_COURSES: Omit<Course, 'id'>[] = [
  { title: 'Educación Inclusiva', description: 'Recursos y estrategias para acompañar trayectorias educativas diversas desde un enfoque inclusivo.', badge: 'Descarga gratuita', badge_type: 'free', link: 'https://drive.google.com/file/d/1GXOx9nWtOgjW1Ve22DXjH6mP9495t0yy/view', cta: 'Descargar gratis →', sort_order: 1, published: true, price: 0, is_free: true },
  { title: 'Intervención Psicopedagógica', description: 'Herramientas clínicas y pedagógicas para el abordaje de las dificultades de aprendizaje.', badge: 'Próximamente', badge_type: 'soon', link: null, cta: null, sort_order: 2, published: true, price: 49999, is_free: false },
  { title: 'Cuerpo y Desarrollo', description: 'Formación sobre la dimensión corporal en el desarrollo infantil y los procesos emocionales.', badge: 'Próximamente', badge_type: 'soon', link: null, cta: null, sort_order: 3, published: true, price: 49999, is_free: false },
  { title: 'Clínica Interdisciplinaria', description: 'Reflexiones y casos clínicos sobre el trabajo conjunto entre disciplinas.', badge: 'Próximamente', badge_type: 'soon', link: null, cta: null, sort_order: 4, published: true, price: 49999, is_free: false },
]

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

interface FormationProps {
  courses?: Course[]
  siteConfig?: Record<string, string>
}

export default function Formation({ courses, siteConfig }: FormationProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const data = courses ?? DEFAULT_COURSES

  const title = siteConfig?.formation_title ?? 'Cursos y materiales.'
  const subtitle = siteConfig?.formation_subtitle ?? 'Recursos formativos desarrollados desde la práctica clínica del equipo ÉCLAT para profesionales del campo.'
  const ctaTitle = siteConfig?.formation_cta_title ?? '¿Buscás formación para tu equipo?'
  const ctaSubtitle = siteConfig?.formation_cta_subtitle ?? 'Diseñamos propuestas a medida para escuelas, equipos de salud y organizaciones.'

  return (
    <section id="formacion" className="py-24 md:py-32 px-5 bg-[#F5F5F7] overflow-hidden">
      <div className="max-w-5xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[#2F7D6B] text-[12px] font-semibold tracking-[0.2em] uppercase mb-5"
        >
          Formación
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.1 }}
            className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.06] max-w-lg"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[16px] text-[#6E6E73] max-w-xs leading-relaxed md:text-right"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Grid de cursos */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {data.map((course, i) => {
            const courseWithId = course as Course
            const isFree = (course as Course).is_free || course.badge_type === 'free'
            const price = (course as Course).price
            const hasId = !!courseWithId.id

            return (
              <motion.div
                key={courseWithId.id ?? course.title}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ ...spring, delay: 0.15 + i * 0.09 }}
                whileHover={{ y: -4, scale: 1.015 }}
                className={`bg-white rounded-2xl md:rounded-3xl overflow-hidden border shadow-sm flex flex-col ${
                  isFree ? 'border-[#2F7D6B]/30' : 'border-black/[0.06]'
                }`}
              >
                {/* Barra superior */}
                <div className={`h-1.5 ${isFree ? 'bg-[#2F7D6B]' : 'bg-[#E8E8E8]'}`} />

                <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-block text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full ${
                      isFree ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#F5F5F7] text-[#86868b]'
                    }`}>
                      {course.badge}
                    </span>
                    {price > 0 && !isFree && (
                      <span className="text-[18px] font-bold text-[#0A0A0A] shrink-0">{formatPrice(price)}</span>
                    )}
                  </div>

                  <h3 className="text-[17px] md:text-[18px] font-semibold text-[#0A0A0A] leading-snug">{course.title}</h3>
                  <p className="text-[13px] md:text-[14px] text-[#6E6E73] leading-relaxed flex-1">{course.description}</p>

                  <div className="pt-3 border-t border-black/[0.06]">
                    {isFree && course.link ? (
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#2F7D6B] hover:underline"
                      >
                        {course.cta}
                      </a>
                    ) : hasId && price > 0 && !isFree ? (
                      <Link
                        href={`/inscripcion/${courseWithId.id}`}
                        className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-5 py-2.5 rounded-full text-[14px] hover:bg-[#245f52] transition-colors"
                      >
                        Comprar curso
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </Link>
                    ) : (
                      <span className="text-[13px] text-[#86868b]">Disponible próximamente</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA institucional */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.55 }}
          className="bg-[#1e5c50] rounded-2xl md:rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #7bc4b5 0%, transparent 70%)' }} />
          <div className="relative">
            <h3 className="text-[20px] md:text-[22px] font-semibold text-white mb-2">{ctaTitle}</h3>
            <p className="text-white/65 text-[14px] md:text-[15px] max-w-md">{ctaSubtitle}</p>
          </div>
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-[#1e5c50] font-semibold px-6 py-3 rounded-full text-[14px] hover:bg-white/90 transition-colors shadow-lg relative"
          >
            Consultanos
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
