'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CARDS = [
  {
    emoji: '🎯',
    title: 'Misión',
    body: 'Potenciar la calidad de vida promoviendo el bienestar emocional, la salud mental y la diversidad.',
  },
  {
    emoji: '💚',
    title: 'Valores',
    body: 'Contención, calidez, confianza y respeto. Un lugar donde cada persona se siente valorada.',
  },
  {
    emoji: '🔗',
    title: 'Enfoque',
    body: 'Mirada singular centrada en las necesidades, deseos y capacidades de cada persona.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

export default function GradientBanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-5">

      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute"
          style={{
            inset: '-8%',
            backgroundImage: 'url(/gradient-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            scale: [1, 1.08, 1],
            x: ['0%', '-4%', '0%'],
            y: ['0%', '-3%', '0%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto" ref={ref}>

        {/* Encabezado */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-4 text-[#2F7D6B]"
          >
            Sobre ÉCLAT
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold tracking-tight leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1B2B26' }}
          >
            Un centro pensado para cada persona
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-[15px] max-w-xl mx-auto leading-relaxed"
            style={{ color: '#4B6B5E' }}
          >
            Habilitado por el Ministerio de Desarrollo Social · Registro Nacional de Prestadores
          </motion.p>
        </div>

        {/* Cards glassmorphism */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-3 gap-5"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 20,
                padding: '2rem',
                boxShadow: '0 4px 24px rgba(47,125,107,0.08)',
              }}
            >
              <span className="text-3xl block mb-4">{card.emoji}</span>
              <h3
                className="font-bold uppercase tracking-[0.14em] mb-3"
                style={{ fontSize: '0.72rem', color: '#2F7D6B' }}
              >
                {card.title}
              </h3>
              <p className="leading-relaxed" style={{ fontSize: '0.95rem', color: '#4B6B5E' }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
