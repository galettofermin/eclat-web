'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Servicio } from '@/lib/types'

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
  const [imageMap, setImageMap] = useState<Record<string, string>>({})
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    fetch('/api/servicios')
      .then(r => r.json())
      .then((data: Servicio[]) => {
        const map: Record<string, string> = {}
        data.forEach(s => { if (s.imagen_url) map[s.nombre] = s.imagen_url })
        setImageMap(map)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % SERVICES.length)
    }, 2500)
    return () => clearInterval(timerRef.current)
  }, [paused])

  const currentName = SERVICES[active]
  const currentImg = imageMap[currentName]

  return (
    <div
      className="mb-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="h-10 flex items-center overflow-hidden mb-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 shrink-0"
          >
            {currentImg ? (
              <img
                src={currentImg}
                alt={currentName}
                width={36}
                height={36}
                style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <span
                className="rounded-full shrink-0"
                style={{ width: 6, height: 6, background: '#5e8f6e', display: 'inline-block' }}
              />
            )}
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 17,
                fontWeight: 500,
                color: '#1e2a24',
              }}
            >
              {currentName}
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
              width: i === active ? 16 : 5,
              height: 5,
              background: i === active ? '#5e8f6e' : 'var(--eclat-border)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
