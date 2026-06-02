'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import ServicesCarousel from './ServicesCarousel'
import type { Course } from '@/lib/types'

const SERVICIOS = [
  { nombre: 'Psicología', desc: 'Atención individual, familiar y grupal', icon: '🧠' },
  { nombre: 'Psicopedagogía', desc: 'Aprendizaje y subjetividad', icon: '📖' },
  { nombre: 'Fonoaudiología', desc: 'Lenguaje, voz y comunicación', icon: '🗣️' },
  { nombre: 'Psicomotricidad', desc: 'Cuerpo y desarrollo', icon: '🤸' },
  { nombre: 'Docente de apoyo', desc: 'Acompañamiento en lo escolar', icon: '🏫' },
  { nombre: 'Acompañante terapéutico', desc: 'Presencia en la vida cotidiana', icon: '🤝' },
  { nombre: 'Evaluaciones', desc: 'Diagnóstico integral y situado', icon: '📋' },
  { nombre: 'Arteterapia', desc: 'El arte como espacio de elaboración', icon: '🎨' },
]

const CARD_COLORS = ['#4a6658', '#5e8f6e', '#3a5444', '#8fbb9e']

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
})

interface Props {
  courses?: Course[]
  greeting: string
  whatsappUrl: string
}

export default function HomeMain({ courses, greeting, whatsappUrl }: Props) {
  const fraseRef = useRef(null)
  const fraseInView = useInView(fraseRef, { once: true, margin: '-60px' })

  return (
    <main className="flex-1 flex flex-col" style={{ marginLeft: 210, minHeight: '100vh' }}>

      {/* Topbar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
        style={{ background: 'var(--eclat-cream)', borderBottom: '1px solid var(--eclat-border)' }}
      >
        <div>
          <p className="font-semibold text-[20px]" style={{ color: 'var(--eclat-text)' }}>{greeting}</p>
          <p className="text-[13px] italic" style={{ color: 'var(--eclat-text-3)' }}>¿Qué te trajo hoy acá?</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <Link
            href="/formaciones"
            className="text-[12px] font-medium px-4 py-2 rounded-lg"
            style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
          >
            Comenzar un recorrido
          </Link>
        </motion.div>
      </div>

      {/* Body */}
      <div className="px-8 py-7 flex-1">

        {/* ── HERO ── */}
        <motion.div
          {...fadeUp(0)}
          className="relative overflow-hidden mb-7"
          style={{
            background: 'var(--eclat-bg-green)',
            border: '1px solid var(--eclat-border)',
            borderRadius: 10,
            padding: '44px 48px',
          }}
        >
          {/* Decoración SVG */}
          <svg className="absolute right-0 top-0 pointer-events-none" width="220" height="220" viewBox="0 0 220 220" style={{ opacity: 0.07 }}>
            <circle cx="180" cy="40" r="60" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
            <circle cx="180" cy="40" r="35" fill="none" stroke="#3a5444" strokeWidth="1"/>
            <line x1="120" y1="0" x2="220" y2="100" stroke="#3a5444" strokeWidth="1"/>
            <line x1="140" y1="0" x2="220" y2="80" stroke="#3a5444" strokeWidth="0.8"/>
            <line x1="160" y1="0" x2="220" y2="60" stroke="#3a5444" strokeWidth="0.6"/>
          </svg>

          <motion.p {...fadeUp(0.08)} className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--eclat-green)' }}>
            ÉCLAT · Centro de atención integral
          </motion.p>

          <motion.h1
            {...fadeUp(0.14)}
            className="mb-4 leading-tight"
            style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: 'var(--eclat-text)', maxWidth: 560 }}
          >
            Salud mental, educación y acompañamiento{' '}
            <em style={{ color: 'var(--eclat-dark-3)', fontStyle: 'italic' }}>interdisciplinario.</em>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--eclat-text-2)', maxWidth: 520 }}>
            Construimos <strong style={{ color: 'var(--eclat-text)' }}>respuestas singulares</strong> frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mb-5" style={{ height: 1, background: '#b8cec0', maxWidth: 520 }} />

          {/* Tres pilares */}
          <motion.div {...fadeUp(0.28)} className="flex gap-0 mb-5" style={{ maxWidth: 520 }}>
            {[
              { titulo: 'Atención', desc: 'Clínica interdisciplinaria' },
              { titulo: 'Formación', desc: 'Cursos con fundamento clínico' },
              { titulo: 'Comunidad', desc: 'Intercambio entre profesionales' },
            ].map((p, i) => (
              <div key={p.titulo} className="flex-1 px-4" style={{ borderLeft: i > 0 ? '1px solid var(--eclat-border)' : 'none' }}>
                <p className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--eclat-text)' }}>{p.titulo}</p>
                <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{p.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Carrusel de servicios */}
          <motion.div {...fadeUp(0.33)}>
            <ServicesCarousel />
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp(0.38)} className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(30,42,36,0.18)' }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/formaciones"
                className="inline-flex text-[12px] font-medium px-5 py-2.5 rounded-lg"
                style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
              >
                Explorar formaciones
              </Link>
            </motion.div>
            <p className="text-[12px] italic" style={{ color: 'var(--eclat-text-4)' }}>Cada uno encuentra lo suyo.</p>
          </motion.div>
        </motion.div>

        {/* ── FORMACIONES ── */}
        {courses && courses.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Formaciones en curso</h2>
              <Link href="/formaciones" className="text-[11px] hover:opacity-70" style={{ color: 'var(--eclat-mid)' }}>Ver todas →</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {courses.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(30,42,36,0.1)' }}
                >
                  <Link
                    href={c.id ? `/formaciones/${c.id}` : '/formaciones'}
                    className="block bg-white rounded-xl overflow-hidden"
                    style={{ border: '1px solid var(--eclat-border)' }}
                  >
                    <div style={{ height: 4, background: CARD_COLORS[i % CARD_COLORS.length] }} />
                    <div className="p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--eclat-mid)' }}>{c.badge || 'Formación'}</p>
                      <p className="text-[13px] font-medium mb-1 leading-snug" style={{ color: 'var(--eclat-text)' }}>{c.title}</p>
                      <p className="text-[11px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--eclat-text-3)' }}>{c.description}</p>
                      <div style={{ height: 2, background: 'var(--eclat-border)', borderRadius: 1 }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── FRASE SEPARADORA ── */}
        <motion.div
          ref={fraseRef}
          initial={{ opacity: 0, y: 14 }}
          animate={fraseInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 px-6 py-5 bg-white rounded-xl"
          style={{ borderLeft: '2.5px solid var(--eclat-dark-3)', border: '1px solid var(--eclat-border)', borderLeftWidth: 2.5 }}
        >
          <p className="text-[15px] leading-relaxed mb-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: 'var(--eclat-text)' }}>
            "Cada situación merece una mirada. Cada persona, un tiempo."
          </p>
          <p className="text-[11px]" style={{ color: 'var(--eclat-text-4)' }}>— Mirada clínica · Ética profesional · Caso por caso</p>
        </motion.div>

        {/* ── SERVICIOS ── */}
        <div>
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--eclat-text)' }}>Servicios</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SERVICIOS.map((s, i) => (
              <motion.div
                key={s.nombre}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, boxShadow: '0 4px 14px rgba(30,42,36,0.08)' }}
              >
                <Link href="/servicios" className="block bg-white rounded-xl p-4 text-center" style={{ border: '1px solid var(--eclat-border)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2.5 text-[17px]" style={{ background: '#e4efe6' }}>
                    {s.icon}
                  </div>
                  <p className="text-[12px] font-semibold mb-0.5" style={{ color: 'var(--eclat-text)' }}>{s.nombre}</p>
                  <p className="text-[10px] leading-snug" style={{ color: 'var(--eclat-text-3)' }}>{s.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
