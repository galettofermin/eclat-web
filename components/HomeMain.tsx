'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Brain, BookOpen, MessageCircle, Activity, School, Heart, ClipboardList, Palette } from 'lucide-react'
import ServicesCarousel from './ServicesCarousel'
import LibraryCarousel from './LibraryCarousel'
import type { Course } from '@/lib/types'

const SERVICIOS = [
  { nombre: 'Psicología', desc: 'Atención individual, familiar y grupal', Icon: Brain },
  { nombre: 'Psicopedagogía', desc: 'Aprendizaje y subjetividad', Icon: BookOpen },
  { nombre: 'Fonoaudiología', desc: 'Lenguaje, voz y comunicación', Icon: MessageCircle },
  { nombre: 'Psicomotricidad', desc: 'Cuerpo y desarrollo', Icon: Activity },
  { nombre: 'Docente de apoyo', desc: 'Acompañamiento en lo escolar', Icon: School },
  { nombre: 'Acompañante terapéutico', desc: 'Presencia en la vida cotidiana', Icon: Heart },
  { nombre: 'Evaluaciones diagnósticas', desc: 'Diagnóstico integral y situado', Icon: ClipboardList },
  { nombre: 'Arteterapia', desc: 'El arte como espacio de elaboración', Icon: Palette },
]

const FORMACIONES_DESTACADAS = [
  {
    banda: '#4a6658',
    publico: 'Para docentes',
    titulo: 'Inclusión escolar: una mirada desde el sujeto',
    desc: 'Pensar la inclusión más allá de la adaptación curricular.',
    href: '/formaciones',
  },
  {
    banda: '#5e8f6e',
    publico: 'Para familias',
    titulo: 'Límites: entre el amor y la ley',
    desc: 'El límite no como castigo sino como función estructurante.',
    href: '/formaciones',
  },
  {
    banda: '#3a5444',
    publico: 'Para profesionales',
    titulo: 'El informe como acto clínico',
    desc: 'Escribir sobre un sujeto sin reducirlo al diagnóstico.',
    href: '/formaciones',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
})

function useFormattedDate() {
  const [fecha, setFecha] = useState('')
  useEffect(() => {
    const d = new Date()
    const str = d.toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    setFecha(str.charAt(0).toUpperCase() + str.slice(1))
  }, [])
  return fecha
}

interface Props {
  courses?: Course[]
  greeting: string
  whatsappUrl: string
}

export default function HomeMain({ whatsappUrl }: Props) {
  const fecha = useFormattedDate()
  const formacionesRef = useRef(null)
  const serviciosRef = useRef(null)
  const formacionesInView = useInView(formacionesRef, { once: true, margin: '-60px' })
  const serviciosInView = useInView(serviciosRef, { once: true, margin: '-60px' })

  return (
    <main className="flex flex-col" style={{ minHeight: '100vh' }}>

      {/* ── TOPBAR ── */}
      <div
        className="hidden md:flex sticky top-0 z-30 items-center justify-between px-8 py-4"
        style={{ background: 'var(--eclat-cream)', borderBottom: '1px solid var(--eclat-border)' }}
      >
        <div>
          <p className="font-semibold text-[18px]" style={{ color: 'var(--eclat-text)' }}>
            {fecha || '—'}
          </p>
          <p className="text-[12px]" style={{ color: 'var(--eclat-text-3)' }}>
            Bienvenido al Centro ÉCLAT
          </p>
        </div>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium px-4 py-2 rounded-lg"
          style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
          whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(30,42,36,0.22)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          Contactanos
        </motion.a>
      </div>

      {/* ── BODY ── */}
      <div className="px-8 py-7 flex-1">

        {/* ── HERO ── */}
        <motion.div
          {...fadeUp(0)}
          className="relative overflow-hidden mb-7"
          style={{
            background: 'var(--eclat-bg-green)',
            border: '1px solid var(--eclat-border)',
            borderRadius: 10,
            padding: '36px 40px',
          }}
        >
          <svg className="absolute right-0 top-0 pointer-events-none" width="180" height="180" viewBox="0 0 220 220" style={{ opacity: 0.06 }}>
            <circle cx="180" cy="40" r="60" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
            <circle cx="180" cy="40" r="35" fill="none" stroke="#3a5444" strokeWidth="1"/>
            <line x1="120" y1="0" x2="220" y2="100" stroke="#3a5444" strokeWidth="1"/>
            <line x1="140" y1="0" x2="220" y2="80" stroke="#3a5444" strokeWidth="0.8"/>
          </svg>

          {/* Grid 60/40 desktop, columna en mobile */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

            {/* Columna izquierda — texto + servicios + CTA */}
            <div className="flex-1 min-w-0">
              <motion.p {...fadeUp(0.08)} className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--eclat-green)' }}>
                ÉCLAT · Centro de atención integral
              </motion.p>

              <motion.h1
                {...fadeUp(0.14)}
                className="mb-4 leading-tight"
                style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 400, color: 'var(--eclat-text)' }}
              >
                Salud mental, educación y acompañamiento{' '}
                <em style={{ color: 'var(--eclat-dark-3)', fontStyle: 'italic' }}>interdisciplinario.</em>
              </motion.h1>

              <motion.p {...fadeUp(0.2)} className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--eclat-text-2)', maxWidth: 440 }}>
                Construimos <strong style={{ color: 'var(--eclat-text)' }}>respuestas singulares</strong> frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.
              </motion.p>

              <motion.div {...fadeUp(0.24)} className="mb-4" style={{ height: 1, background: '#b8cec0', maxWidth: 440 }} />

              {/* Tres pilares */}
              <motion.div {...fadeUp(0.28)} className="flex gap-0 mb-5" style={{ maxWidth: 440 }}>
                {[
                  { titulo: 'Atención', desc: 'Clínica interdisciplinaria' },
                  { titulo: 'Formación', desc: 'Cursos con fundamento clínico' },
                  { titulo: 'Comunidad', desc: 'Intercambio entre profesionales' },
                ].map((p, i) => (
                  <div key={p.titulo} className="flex-1 px-3" style={{ borderLeft: i > 0 ? '1px solid var(--eclat-border)' : 'none' }}>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--eclat-text)' }}>{p.titulo}</p>
                    <p className="text-[10px]" style={{ color: 'var(--eclat-text-3)' }}>{p.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* Carrusel servicios */}
              <motion.div {...fadeUp(0.33)}>
                <ServicesCarousel />
              </motion.div>

              {/* CTA */}
              <motion.div {...fadeUp(0.38)} className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(30,42,36,0.18)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Link
                    href="/formaciones"
                    className="inline-flex text-[12px] font-medium px-5 py-2.5 rounded-lg"
                    style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
                  >
                    Conocer el centro
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Columna derecha — Biblioteca (solo desktop) */}
            <motion.div
              {...fadeUp(0.12)}
              className="hidden lg:flex flex-col shrink-0"
              style={{ width: '38%', minWidth: 220 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--eclat-green)' }}>
                Biblioteca
              </p>
              <LibraryCarousel />
            </motion.div>
          </div>

          {/* Biblioteca mobile — debajo del texto */}
          <div className="lg:hidden mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--eclat-green)' }}>
              Biblioteca
            </p>
            <LibraryCarousel />
          </div>
        </motion.div>

        {/* ── FORMACIONES ── */}
        <div className="mb-7" ref={formacionesRef}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold" style={{ color: 'var(--eclat-text)' }}>Formaciones</h2>
            <Link href="/formaciones" className="text-[11px] hover:opacity-70 transition-opacity" style={{ color: 'var(--eclat-mid)' }}>
              Ver todas las formaciones →
            </Link>
          </div>
          {/* Flex horizontal con scroll en mobile, grid en desktop */}
          <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
            {FORMACIONES_DESTACADAS.map((f, i) => (
              <motion.div
                key={f.titulo}
                initial={{ opacity: 0, y: 16 }}
                animate={formacionesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 sm:shrink"
                style={{ scrollSnapAlign: 'start', minWidth: 240 }}
              >
                <Link
                  href={f.href}
                  className="block bg-white rounded-xl overflow-hidden h-full transition-shadow hover:shadow-md"
                  style={{ border: '1px solid var(--eclat-border)' }}
                >
                  <div style={{ height: 4, background: f.banda }} />
                  <div className="p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: 'var(--eclat-mid)' }}>{f.publico}</p>
                    <p className="text-[13px] font-medium mb-1.5 leading-snug" style={{ color: 'var(--eclat-text)' }}>{f.titulo}</p>
                    <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--eclat-text-3)' }}>{f.desc}</p>
                    <span
                      className="inline-block text-[11px] font-medium px-3 py-1.5 rounded-md"
                      style={{ border: '1px solid var(--eclat-dark-3)', color: 'var(--eclat-dark-3)' }}
                    >
                      Ver formación
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── SERVICIOS ── */}
        <div ref={serviciosRef}>
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--eclat-text)' }}>Servicios</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {SERVICIOS.map((s, i) => (
              <motion.div
                key={s.nombre}
                initial={{ opacity: 0, y: 14 }}
                animate={serviciosInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(30,42,36,0.08)' }}
              >
                <Link
                  href="/servicios"
                  className="block bg-white rounded-xl p-4 text-center transition-colors"
                  style={{ border: '1px solid var(--eclat-border)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3a5444'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--eclat-border)'}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2.5" style={{ background: '#e4efe6' }}>
                    <s.Icon size={16} color="#3a5444" />
                  </div>
                  <p className="text-[12px] font-medium mb-0.5" style={{ color: 'var(--eclat-text)' }}>{s.nombre}</p>
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
