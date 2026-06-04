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
  const fraseRef = useRef(null)
  const formacionesInView = useInView(formacionesRef, { once: true, margin: '-60px' })
  const serviciosInView = useInView(serviciosRef, { once: true, margin: '-60px' })
  const fraseInView = useInView(fraseRef, { once: true, margin: '-40px' })

  return (
    <main className="flex flex-col" style={{ minHeight: '100vh', background: '#ffffff' }}>

      {/* ── TOPBAR ── */}
      <div
        className="hidden md:flex sticky top-0 z-30 items-center justify-between"
        style={{
          background: '#ffffff',
          borderBottom: '0.5px solid #f0f4f1',
          padding: '0 48px',
          height: 60,
        }}
      >
        <div>
          <p className="font-medium text-[15px]" style={{ color: '#1e2a24' }}>
            {fecha || '—'}
          </p>
          <p className="text-[11px]" style={{ color: '#8a9e92' }}>
            Centro ÉCLAT
          </p>
        </div>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium"
          style={{
            background: '#1e2a24',
            color: '#d4e0d8',
            padding: '10px 22px',
            borderRadius: 6,
          }}
          whileHover={{ opacity: 0.88 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          Contactanos
        </motion.a>
      </div>

      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '56px 64px 80px', background: '#ffffff' }}
      >
        <div className="flex flex-col lg:flex-row items-stretch" style={{ gap: 80 }}>

          {/* Columna izquierda */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Kicker */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                fontSize: 10,
                color: '#8aab94',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: 20,
              }}
            >
              ÉCLAT · Centro de atención integral
            </motion.p>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 42,
                fontWeight: 500,
                color: '#1e2a24',
                lineHeight: 1.2,
                marginBottom: 24,
              }}
            >
              Salud mental, educación y acompañamiento{' '}
              <em style={{ fontStyle: 'italic', color: '#4a6658' }}>interdisciplinario.</em>
            </motion.h1>

            {/* Bajada */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.6 }}
              style={{
                fontSize: 15,
                color: '#6b7c74',
                lineHeight: 1.8,
                marginBottom: 32,
                maxWidth: 460,
              }}
            >
              Construimos{' '}
              <strong style={{ fontWeight: 500, color: '#2d3e35' }}>respuestas singulares</strong>{' '}
              frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.
            </motion.p>

            {/* Separador */}
            <div style={{ height: '0.5px', background: '#e8ede9', maxWidth: 460, marginBottom: 24 }} />

            {/* Pilares */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="flex"
              style={{ maxWidth: 460, marginBottom: 32 }}
            >
              {[
                { titulo: 'Atención', desc: 'Clínica interdisciplinaria' },
                { titulo: 'Formación', desc: 'Cursos con fundamento clínico' },
                { titulo: 'Comunidad', desc: 'Intercambio entre profesionales' },
              ].map((p, i) => (
                <div
                  key={p.titulo}
                  className="flex-1 px-4"
                  style={{ borderLeft: i > 0 ? '0.5px solid #e8ede9' : 'none', paddingLeft: i === 0 ? 0 : 16 }}
                >
                  <p style={{ fontSize: 9, fontWeight: 500, color: '#8aab94', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 3 }}>
                    {p.titulo}
                  </p>
                  <p style={{ fontSize: 12, color: '#3a5444' }}>{p.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Carrusel servicios */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.6 }}
            >
              <ServicesCarousel />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'inline-block' }}
              >
                <Link
                  href="/formaciones"
                  style={{
                    display: 'inline-flex',
                    background: '#1e2a24',
                    color: '#d4e0d8',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '12px 28px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Conocer el centro
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Columna derecha — Biblioteca */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col shrink-0"
            style={{ width: '38%', minWidth: 240 }}
          >
            <p
              className="shrink-0"
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: '#8aab94',
                textTransform: 'uppercase',
                letterSpacing: '1.4px',
                marginBottom: 14,
              }}
            >
              BIBLIOTECA
            </p>
            <LibraryCarousel className="flex-1" />
          </motion.div>
        </div>

        {/* Biblioteca mobile */}
        <div className="lg:hidden mt-10">
          <p style={{ fontSize: 9, fontWeight: 500, color: '#8aab94', textTransform: 'uppercase', letterSpacing: '1.4px', marginBottom: 12 }}>
            BIBLIOTECA
          </p>
          <LibraryCarousel />
        </div>
      </motion.div>

      {/* ── DIVISOR ── */}
      <div style={{ height: '0.5px', background: '#f0f4f1', margin: '0 64px' }} />

      {/* ── FRASE SEPARADORA ── */}
      <motion.div
        ref={fraseRef}
        initial={{ opacity: 0, x: -8 }}
        animate={fraseInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '48px 64px',
          borderLeft: '2px solid #3a5444',
          marginLeft: 64,
          marginRight: 64,
          marginTop: 48,
          marginBottom: 48,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontStyle: 'italic',
            color: '#2d3e35',
            lineHeight: 1.5,
            marginBottom: 6,
          }}
        >
          "Cada situación merece una mirada. Cada persona, un tiempo."
        </p>
        <p style={{ fontSize: 11, color: '#8a9e92' }}>— Mirada clínica · Ética profesional · Caso por caso</p>
      </motion.div>

      {/* ── FORMACIONES ── */}
      <div style={{ padding: '0 64px 56px' }} ref={formacionesRef}>
        <div className="flex items-baseline justify-between" style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              fontWeight: 500,
              color: '#1e2a24',
            }}
          >
            Formaciones
          </h2>
          <Link
            href="/formaciones"
            style={{ fontSize: 11, color: '#8aab94' }}
            className="hover:opacity-70 transition-opacity"
          >
            Ver todas las formaciones →
          </Link>
        </div>
        <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
          {FORMACIONES_DESTACADAS.map((f, i) => (
            <motion.div
              key={f.titulo}
              initial={{ opacity: 0, y: 14 }}
              animate={formacionesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 sm:shrink"
              style={{ scrollSnapAlign: 'start', minWidth: 240 }}
            >
              <Link
                href={f.href}
                aria-label={`Ver formación: ${f.titulo}`}
                className="block h-full transition-all"
                style={{ border: '0.5px solid #e4ede6', borderRadius: 10, overflow: 'hidden', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3a5444'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4ede6'}
              >
                <div style={{ height: 3, background: f.banda }} />
                <div style={{ padding: '16px 18px' }}>
                  <p style={{ fontSize: 9, fontWeight: 500, color: '#8aab94', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>
                    {f.publico}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1e2a24', lineHeight: 1.45, marginBottom: 8 }}>
                    {f.titulo}
                  </p>
                  <p style={{ fontSize: 11, color: '#8a9e92', lineHeight: 1.6, marginBottom: 14 }}>
                    {f.desc}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '6px 12px',
                      border: '0.5px solid #3a5444',
                      borderRadius: 5,
                      color: '#3a5444',
                    }}
                  >
                    Ver formación
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── DIVISOR ── */}
      <div style={{ height: '0.5px', background: '#f0f4f1', margin: '0 64px' }} />

      {/* ── SERVICIOS ── */}
      <div style={{ padding: '56px 64px' }} ref={serviciosRef}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            fontWeight: 500,
            color: '#1e2a24',
            marginBottom: 24,
          }}
        >
          Servicios
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SERVICIOS.map((s, i) => (
            <motion.div
              key={s.nombre}
              initial={{ opacity: 0, y: 12 }}
              animate={serviciosInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href="/servicios"
                aria-label={`Ver información sobre ${s.nombre}`}
                className="block text-center transition-all"
                style={{ border: '0.5px solid #e4ede6', borderRadius: 10, padding: '20px 16px', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3a5444'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e4ede6'}
              >
                <div
                  className="flex items-center justify-center mx-auto mb-3"
                  style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f7f2' }}
                >
                  <s.Icon size={15} color="#3a5444" aria-hidden="true" />
                </div>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1e2a24', marginBottom: 3 }}>{s.nombre}</p>
                <p style={{ fontSize: 10, color: '#8a9e92', lineHeight: 1.4 }}>{s.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  )
}
