'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Course } from '@/lib/types'

const DEFAULT_COURSES = [
  { id: '', title: 'Educación Inclusiva', description: 'Recursos para acompañar trayectorias educativas diversas desde un enfoque inclusivo.', badge: 'Descarga gratuita', badge_type: 'free', price: 0, price_original: 0, is_free: true },
  { id: '', title: 'Intervención Psicopedagógica', description: 'Herramientas para el abordaje de las dificultades de aprendizaje.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false },
  { id: '', title: 'Cuerpo y Desarrollo', description: 'Formación sobre la dimensión corporal en el desarrollo infantil.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false },
  { id: '', title: 'Clínica Interdisciplinaria', description: 'Reflexiones y casos clínicos sobre el trabajo conjunto entre disciplinas.', badge: 'Próximamente', badge_type: 'soon', price: 49999, price_original: 85000, is_free: false },
]

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

interface CoursesCarouselProps {
  courses?: Course[]
}

const VISIBLE_DESKTOP = 3

export default function CoursesCarousel({ courses }: CoursesCarouselProps) {
  const data = courses?.length ? courses : DEFAULT_COURSES
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const go = useCallback((idx: number, dir: number) => {
    clearInterval(intervalRef.current)
    setDirection(dir)
    setActive((idx + data.length) % data.length)
  }, [data.length])

  const next = useCallback(() => go(active + 1, 1), [active, go])
  const prev = useCallback(() => go(active - 1, -1), [active, go])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(next, 4500)
    return () => clearInterval(intervalRef.current)
  }, [paused, next])

  // En desktop mostramos VISIBLE_DESKTOP tarjetas a la vez
  const getVisibleIndices = () => {
    const indices = []
    for (let i = 0; i < VISIBLE_DESKTOP; i++) {
      indices.push((active + i) % data.length)
    }
    return indices
  }

  return (
    <section className="py-16 md:py-24 px-5 bg-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#2F7D6B] mb-2">Formaciones</p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight">
              Toda nuestra oferta formativa
            </h2>
          </div>

          {/* Controles */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-[#F5F5F7] hover:border-[#2F7D6B]/40 transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2" className="group-hover:stroke-[#2F7D6B] transition-colors">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button onClick={next}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-[#F5F5F7] hover:border-[#2F7D6B]/40 transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2" className="group-hover:stroke-[#2F7D6B] transition-colors">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop: 3 tarjetas visibles */}
        <div className="hidden md:grid grid-cols-3 gap-5 mb-8">
          {getVisibleIndices().map((idx, position) => {
            const course = data[idx] as any
            const isFree = course.is_free || course.badge_type === 'free'
            const isCenter = position === 0
            const hasId = !!course.id
            const href = hasId ? `/cursos/${course.id}` : '/formacion'
            const discount = course.price_original > course.price && !isFree
              ? Math.round(((course.price_original - course.price) / course.price_original) * 100)
              : 0

            return (
              <motion.div
                key={`${idx}-${position}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: isCenter ? 1.03 : 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28, delay: position * 0.06 }}
                whileHover={{ y: -6, scale: isCenter ? 1.05 : 1.03 }}
              >
                <Link href={href}
                  className={`block bg-white rounded-2xl border overflow-hidden h-full transition-all duration-300 ${
                    isCenter
                      ? 'border-[#2F7D6B]/40 shadow-xl shadow-[#2F7D6B]/12'
                      : 'border-black/[0.07] shadow-md hover:shadow-lg hover:border-[#2F7D6B]/30'
                  }`}
                >
                  {/* Barra de color */}
                  <div className={`h-1.5 transition-all ${isCenter ? 'bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]' : 'bg-[#E8E8E8]'}`} />

                  <div className="p-6 flex flex-col h-full">
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${
                        isFree ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#F5F5F7] text-[#86868b]'
                      }`}>
                        {course.badge}
                      </span>
                      {discount > 0 && (
                        <span className="text-[10px] font-bold bg-[#2F7D6B] text-white px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-[17px] font-semibold text-[#0A0A0A] mb-2 leading-snug">{course.title}</h3>
                    <p className="text-[13px] text-[#6E6E73] leading-relaxed flex-1 mb-5">{course.description}</p>

                    {/* Precio */}
                    <div className="mb-5">
                      {course.price_original > course.price && !isFree && (
                        <p className="text-[12px] text-[#86868b] line-through">{formatPrice(course.price_original)}</p>
                      )}
                      <p className={`text-[22px] font-bold ${isFree ? 'text-[#2F7D6B]' : 'text-[#0A0A0A]'}`}>
                        {isFree ? 'Gratuito' : formatPrice(course.price)}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className={`w-full text-center py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                      isCenter
                        ? 'bg-[#2F7D6B] text-white hover:bg-[#245f52]'
                        : 'bg-[#F5F5F7] text-[#424245] hover:bg-[#DCEFE8] hover:text-[#2F7D6B]'
                    }`}>
                      {isFree ? 'Descargar gratis' : hasId ? 'Ver curso →' : 'Próximamente'}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile: una tarjeta a la vez */}
        <div className="md:hidden relative overflow-hidden mb-8">
          <AnimatePresence mode="wait" custom={direction}>
            {(() => {
              const course = data[active] as any
              const isFree = course.is_free || course.badge_type === 'free'
              const hasId = !!course.id
              const href = hasId ? `/cursos/${course.id}` : '/formacion'
              const discount = course.price_original > course.price && !isFree
                ? Math.round(((course.price_original - course.price) / course.price_original) * 100)
                : 0

              return (
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Link href={href}
                    className="block bg-white rounded-2xl border border-[#2F7D6B]/30 shadow-xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#2F7D6B] to-[#3a9980]" />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${
                          isFree ? 'bg-[#DCEFE8] text-[#2F7D6B]' : 'bg-[#F5F5F7] text-[#86868b]'
                        }`}>{course.badge}</span>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold bg-[#2F7D6B] text-white px-2 py-0.5 rounded-full">-{discount}%</span>
                        )}
                      </div>
                      <h3 className="text-[20px] font-semibold text-[#0A0A0A] mb-2">{course.title}</h3>
                      <p className="text-[14px] text-[#6E6E73] leading-relaxed mb-5">{course.description}</p>
                      <div className="mb-5">
                        {course.price_original > course.price && !isFree && (
                          <p className="text-[13px] text-[#86868b] line-through">{formatPrice(course.price_original)}</p>
                        )}
                        <p className={`text-[26px] font-bold ${isFree ? 'text-[#2F7D6B]' : 'text-[#0A0A0A]'}`}>
                          {isFree ? 'Gratuito' : formatPrice(course.price)}
                        </p>
                      </div>
                      <div className="bg-[#2F7D6B] text-white text-center py-3.5 rounded-xl text-[15px] font-semibold">
                        {isFree ? 'Descargar gratis' : hasId ? 'Ver curso →' : 'Próximamente'}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })()}
          </AnimatePresence>

          {/* Flechas mobile */}
          <div className="flex items-center justify-between mt-5">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button key={i} onClick={() => go(i, i > active ? 1 : -1)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 h-2 bg-[#2F7D6B]' : 'w-2 h-2 bg-black/15'
                  }`}
                />
              ))}
            </div>

            <button onClick={next}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#424245" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Dots desktop */}
        <div className="hidden md:flex items-center justify-center gap-2">
          {data.map((_, i) => (
            <button key={i} onClick={() => go(i, i > active ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'w-7 h-2 bg-[#2F7D6B]' : 'w-2 h-2 bg-black/15 hover:bg-black/30'
              }`}
            />
          ))}
        </div>

        {/* Link ver todos */}
        <div className="text-center mt-8">
          <Link href="/formacion"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#2F7D6B] hover:underline">
            Ver todas las formaciones
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
