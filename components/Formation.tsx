'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'

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
  const ctaTitle = siteConfig?.formation_cta_title ?? '¿Buscás formación para tu equipo o institución?'
  const ctaSubtitle = siteConfig?.formation_cta_subtitle ?? 'Diseñamos propuestas a medida para escuelas, equipos de salud y organizaciones.'

  return (
    <section id="formacion" className="py-32 px-6 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto">
        <div ref={ref}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-[#2F7D6B] text-[13px] font-semibold tracking-widest uppercase mb-4">Formación</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight mb-4 max-w-2xl">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="text-[17px] text-[#6E6E73] mb-16 max-w-xl">{subtitle}</motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {data.map((course, i) => {
            const courseWithId = course as Course
            const isFree = (course as any).is_free || course.badge_type === 'free'
            const price = (course as any).price
            const hasId = !!courseWithId.id

            return (
              <motion.div
                key={courseWithId.id ?? course.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl overflow-hidden border border-black/5 flex flex-col"
              >
                <div className="h-1.5 bg-[#2F7D6B]" />
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-block text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full w-fit ${
                      isFree ? 'bg-[#DCEFE8] text-[#2F7D6B]' : course.badge_type === 'soon' ? 'bg-[#F5F5F7] text-[#6E6E73]' : 'bg-[#DCEFE8] text-[#2F7D6B]'
                    }`}>
                      {course.badge}
                    </span>
                    {price > 0 && !isFree && (
                      <span className="text-[17px] font-bold text-[#0A0A0A] shrink-0">{formatPrice(price)}</span>
                    )}
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#0A0A0A] leading-snug">{course.title}</h3>
                  <p className="text-[14px] text-[#6E6E73] leading-relaxed flex-1">{course.description}</p>
                  <div className="pt-2 border-t border-black/5">
                    {isFree && course.link ? (
                      <a href={course.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[14px] font-semibold text-[#2F7D6B] hover:underline">
                        {course.cta}
                      </a>
                    ) : hasId && price > 0 && !isFree ? (
                      <Link href={`/inscripcion/${courseWithId.id}`} className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-5 py-2.5 rounded-full text-[14px] hover:bg-[#245f52] transition-colors">
                        Comprar curso →
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 bg-[#2F7D6B] rounded-2xl p-10 text-center text-white"
        >
          <h3 className="text-[22px] font-semibold mb-3">{ctaTitle}</h3>
          <p className="text-white/80 text-[15px] mb-6 max-w-md mx-auto">{ctaSubtitle}</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#2F7D6B] font-semibold px-6 py-3 rounded-full text-[15px] hover:bg-white/90 transition-colors">
            Consultanos sin compromiso
          </a>
        </motion.div>
      </div>
    </section>
  )
}
