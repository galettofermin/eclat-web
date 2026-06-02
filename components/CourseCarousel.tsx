'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const COURSES = [
  {
    publico: 'Para docentes',
    titulo: 'Inclusión escolar: una mirada desde el sujeto',
    desc: 'Pensar la inclusión más allá de la adaptación.',
    href: '/formaciones',
  },
  {
    publico: 'Para familias',
    titulo: 'Límites: entre el amor y la ley',
    desc: 'El límite no como castigo sino como función.',
    href: '/formaciones',
  },
  {
    publico: 'Para profesionales',
    titulo: 'El informe como acto clínico',
    desc: 'Escribir sobre un sujeto sin reducirlo.',
    href: '/formaciones',
  },
  {
    publico: 'Para familias y docentes',
    titulo: 'Adolescencia: escuchar antes de corregir',
    desc: 'Qué dice la conducta que el adolescente no puede decir todavía.',
    href: '/formaciones',
  },
]

export default function CourseCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % COURSES.length)
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [paused])

  const course = COURSES[active]

  return (
    <div
      className="shrink-0"
      style={{ width: 220 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white"
          style={{
            border: '1px solid var(--eclat-border-2)',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.13em] mb-2"
            style={{ color: 'var(--eclat-mid)' }}
          >
            {course.publico}
          </p>
          <p
            className="text-[13px] font-medium leading-snug mb-1.5"
            style={{ color: 'var(--eclat-text)' }}
          >
            {course.titulo}
          </p>
          <p
            className="text-[11px] leading-relaxed mb-4"
            style={{ color: 'var(--eclat-text-3)' }}
          >
            {course.desc}
          </p>
          <Link
            href={course.href}
            className="inline-block text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{
              border: '1px solid var(--eclat-dark-3)',
              color: 'var(--eclat-dark-3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--eclat-dark-3)'
              ;(e.currentTarget as HTMLElement).style.color = 'white'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--eclat-dark-3)'
            }}
          >
            Ver formación →
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-1.5 mt-3 justify-center">
        {COURSES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 6000) }}
            className="rounded-full transition-all"
            style={{
              width: i === active ? 16 : 5,
              height: 5,
              background: i === active ? 'var(--eclat-mid)' : 'var(--eclat-border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
