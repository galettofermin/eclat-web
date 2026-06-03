'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ARTICLES = [
  {
    categoria: 'PSICOPEDAGOGÍA',
    titulo: 'El síntoma en el aprendizaje: una lectura clínica',
    desc: 'Pensar las dificultades escolares más allá del déficit.',
  },
  {
    categoria: 'CLÍNICA',
    titulo: 'La escucha como posición ética',
    desc: 'Sobre el lugar del profesional frente a la singularidad del caso.',
  },
  {
    categoria: 'FAMILIA',
    titulo: 'Límites y autoridad en la crianza contemporánea',
    desc: 'Una mirada sobre la función de la ley en la infancia.',
  },
  {
    categoria: 'ADOLESCENCIA',
    titulo: 'El cuerpo que habla: psicomotricidad y subjetividad',
    desc: 'Cuando el movimiento es también una forma de decir.',
  },
  {
    categoria: 'INSTITUCIÓN',
    titulo: 'Interdisciplina: coordinación o encuentro',
    desc: 'Qué implica trabajar junto a otros desde una ética compartida.',
  },
]

export default function LibraryCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % ARTICLES.length)
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [paused])

  const article = ARTICLES[active]

  return (
    <div
      className="w-full"
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
          className="bg-white w-full"
          style={{
            border: '1px solid #c8d8cc',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <p
            className="uppercase tracking-[0.12em] mb-2"
            style={{ fontSize: 9, color: '#5e8f6e', fontWeight: 600 }}
          >
            {article.categoria}
          </p>
          <p
            className="leading-snug mb-2"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#1e2a24',
            }}
          >
            {article.titulo}
          </p>
          <p
            className="mb-4"
            style={{ fontSize: 12, color: '#6b7c74', lineHeight: 1.5 }}
          >
            {article.desc}
          </p>
          <button
            className="text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
            style={{ border: '1px solid #3a5444', color: '#3a5444', background: 'transparent' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#3a5444'
              ;(e.currentTarget as HTMLElement).style.color = 'white'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#3a5444'
            }}
          >
            Leer
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-1.5 mt-3 justify-center">
        {ARTICLES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); setTimeout(() => setPaused(false), 6000) }}
            className="rounded-full transition-all"
            style={{
              width: i === active ? 16 : 5,
              height: 5,
              background: i === active ? '#5e8f6e' : '#c8d8cc',
            }}
          />
        ))}
      </div>
    </div>
  )
}
