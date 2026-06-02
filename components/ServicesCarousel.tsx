'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SERVICES = [
  'Psicología',
  'Psicopedagogía',
  'Fonoaudiología',
  'Psicomotricidad',
  'Docente de apoyo',
  'Acompañante terapéutico',
  'Evaluaciones diagnósticas',
  'Arteterapia',
]

export default function ServicesCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % SERVICES.length)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [paused])

  return (
    <div
      className="mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Item activo */}
      <div className="h-7 flex items-center overflow-hidden mb-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 shrink-0"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: 'var(--eclat-mid)' }}
            />
            <span
              className="text-[14px] font-medium"
              style={{ color: 'var(--eclat-text)' }}
            >
              {SERVICES[active]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 5000) }}
            className="transition-all rounded-full"
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
