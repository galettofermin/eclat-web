'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Course } from '@/lib/types'

const DEFAULT_COURSES: Partial<Course>[] = [
  { id: '', title: 'Educación Inclusiva', description: 'Recursos y estrategias para acompañar trayectorias educativas diversas desde un enfoque inclusivo.', badge: 'Descarga gratuita', badge_type: 'free', price: 0, price_original: 0, is_free: true, duration: '', level: '' },
  { id: '', title: 'Intervención Psicopedagógica', description: 'Herramientas clínicas y pedagógicas para el abordaje de las dificultades de aprendizaje en distintos contextos educativos.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false, duration: '', level: '' },
  { id: '', title: 'Cuerpo y Desarrollo', description: 'Formación sobre la dimensión corporal en el desarrollo infantil y su rol en los procesos emocionales y de aprendizaje.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false, duration: '', level: '' },
  { id: '', title: 'Clínica Interdisciplinaria', description: 'Reflexiones y casos clínicos sobre el trabajo conjunto entre disciplinas para construir una mirada integral.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false, duration: '', level: '' },
]

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

interface CoursesCarouselProps {
  courses?: Course[]
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, scale: 0.95 }),
}

export default function CoursesCarousel({ courses }: CoursesCarouselProps) {
  const data = (courses?.length ? courses : DEFAULT_COURSES) as Course[]
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const goTo = useCallback((idx: number, d: number) => {
    setDir(d)
    setActive((idx + data.length) % data.length)
  }, [data.length])

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 4200)
    return () => clearInterval(timerRef.current)
  }, [paused, next])

  const course = data[active]
  const isFree = course?.is_free || course?.badge_type === 'free'
  const hasId = !!course?.id
  const href = hasId ? `/cursos/${course.id}` : '/formacion'
  const discount = !isFree && course?.price_original > course?.price
    ? Math.round(((course.price_original - course.price) / course.price_original) * 100)
    : 0

  return (
    <section
      className="py-16 md:py-24 px-5 bg-[#F5F5F7]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#2F7D6B] mb-2">Formaciones</p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight">
              Toda nuestra oferta formativa
            </h2>
          </div>
          {/* Flechas desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-white hover:border-[#2F7D6B]/50 hover:shadow-md transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2"
                className="group-hover:stroke-[#2F7D6B] transition-colors">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button onClick={next}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-white hover:border-[#2F7D6B]/50 hover:shadow-md transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2"
                className="group-hover:stroke-[#2F7D6B] transition-colors">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel principal */}
        <div className="flex gap-5 items-stretch">

          {/* Tarjeta activa — grande */}
          <div className="flex-1 relative overflow-hidden min-h-[340px] md:min-h-[360px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="absolute inset-0"
              >
                <Link href={href}
                  className="block h-full bg-white rounded-3xl overflow-hidden border border-black/[0.06] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-[#2F7D6B]/10 transition-all duration-300">
                  <div className="h-1.5 bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]" />
                  <div className="p-7 md:p-9 flex flex-col h-full">
                    {/* Top badges row */}
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2F7D6B] bg-[#DCEFE8] px-3 py-1 rounded-full">
                        Curso destacado
                      </span>
                      {isFree && (
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2F7D6B] border border-[#2F7D6B]/30 px-3 py-1 rounded-full">
                          Descarga gratuita
                        </span>
                      )}
                    </div>

                    <h3 className="text-[clamp(1.5rem,3.5vw,2rem)] font-bold text-[#0A0A0A] mb-3 leading-snug">
                      {course?.title}
                    </h3>
                    <p className="text-[15px] text-[#6E6E73] leading-relaxed mb-8 max-w-lg flex-1">
                      {course?.description}
                    </p>

                    {/* Precio */}
                    <div className="flex items-end gap-4 mb-7 flex-wrap">
                      {!isFree ? (
                        <>
                          {discount > 0 && (
                            <div>
                              <p className="text-[14px] text-[#86868b] line-through leading-none mb-1">
                                {formatPrice(course.price_original)}
                              </p>
                              <p className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-[#0A0A0A] leading-none">
                                {formatPrice(course.price)}
                              </p>
                            </div>
                          )}
                          {discount > 0 && (
                            <span className="text-[13px] font-bold bg-red-50 text-red-400 border border-red-100 px-3 py-1.5 rounded-full mb-1">
                              -{discount}%
                            </span>
                          )}
                          {!discount && (
                            <p className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-[#0A0A0A] leading-none">
                              {formatPrice(course.price)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-[#2F7D6B] leading-none">
                          Gratuito
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] px-7 py-3.5 rounded-full shadow-lg shadow-[#2F7D6B]/25 hover:bg-[#245f52] transition-colors">
                        {isFree ? 'Descargar gratis' : 'Ver curso'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                      {course?.duration && (
                        <span className="text-[12px] text-[#86868b] flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {course.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vista previa del siguiente — desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="h-full bg-white rounded-3xl border border-black/[0.05] overflow-hidden opacity-60 scale-[0.97] origin-left">
              <div className="h-1.5 bg-[#E8E8E8]" />
              <div className="p-7">
                {(() => {
                  const next_ = data[(active + 1) % data.length]
                  const nextFree = next_?.is_free || next_?.badge_type === 'free'
                  const nextDiscount = !nextFree && next_?.price_original > next_?.price
                    ? Math.round(((next_.price_original - next_.price) / next_.price_original) * 100)
                    : 0
                  return (
                    <>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b] bg-[#F5F5F7] px-2.5 py-1 rounded-full">Siguiente</span>
                      <h4 className="text-[17px] font-semibold text-[#424245] mt-4 mb-3 leading-snug">{next_?.title}</h4>
                      <p className="text-[13px] text-[#86868b] leading-relaxed mb-5 line-clamp-3">{next_?.description}</p>
                      <div>
                        {nextDiscount > 0 && <p className="text-[12px] text-[#86868b] line-through">{formatPrice(next_.price_original)}</p>}
                        <p className="text-[20px] font-bold text-[#424245]">
                          {nextFree ? 'Gratuito' : formatPrice(next_.price)}
                        </p>
                        {nextDiscount > 0 && (
                          <span className="text-[11px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">-{nextDiscount}%</span>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Dots + flechas mobile */}
        <div className="flex items-center justify-between mt-7">
          <button onClick={prev}
            className="sm:hidden w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className="flex items-center gap-2 mx-auto">
            {data.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > active ? 1 : -1)}
                className={`rounded-full transition-all duration-400 ${
                  i === active ? 'w-8 h-2.5 bg-[#2F7D6B]' : 'w-2.5 h-2.5 bg-black/15 hover:bg-black/30'
                }`}
              />
            ))}
          </div>

          <button onClick={next}
            className="sm:hidden w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <Link href="/formacion"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2F7D6B] hover:underline">
            Ver todas
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
