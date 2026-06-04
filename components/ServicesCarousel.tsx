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
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % SERVICES.length)
    }, 2500)
    return () => clearInterval(timerRef.current)
  }, [paused])

  return (
    <div
      className="mb-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="h-8 flex items-center overflow-hidden mb-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 shrink-0"
          >
            <span
              style={{
                width: 5, height: 5,
                borderRadius: '50%',
                background: '#5e8f6e',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                fontWeight: 500,
                color: '#1e2a24',
              }}
            >
              {SERVICES[active]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5">
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 5000) }}
            className="transition-all rounded-full"
            style={{
              width: i === active ? 14 : 4,
              height: 4,
              background: i === active ? '#5e8f6e' : '#e4ede6',
            }}
          />
        ))}
      </div>
    </div>
  )
}
