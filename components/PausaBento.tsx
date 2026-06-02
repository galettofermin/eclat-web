'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import type { Article } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

const FEATURED_IMAGE = 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800'

const DEFAULT_ARTICLES: Partial<Article>[] = [
  {
    title: 'Cuerpo, voz y palabra: tres modos de estar en el mundo',
    category: 'Clínica',
    excerpt: 'Una reflexión sobre cómo cada disciplina del centro abre una vía singular hacia el sujeto.',
    read_time: '6 min',
    featured: true,
    created_at: '2026-05-10T00:00:00Z',
  },
  {
    title: 'El lugar de la escucha en el trabajo con niños',
    category: 'Profesionales',
    excerpt: 'Escuchar a un niño no es solo prestarle atención. Es abrir un espacio donde lo que trae pueda tener lugar, forma y sentido.',
    read_time: '5 min',
    featured: false,
    created_at: '2026-05-02T00:00:00Z',
  },
  {
    title: '¿Qué es una dificultad de aprendizaje? Más allá del diagnóstico',
    category: 'Aprendizaje',
    excerpt: 'Reducir las dificultades de aprendizaje a un rótulo diagnóstico puede dejar afuera lo más importante: la singularidad de cada proceso.',
    read_time: '7 min',
    featured: false,
    created_at: '2026-04-18T00:00:00Z',
  },
]

const formatMonth = (dateStr?: string) => {
  if (!dateStr) return 'Mayo 2026'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    .replace(/^(.)/, (c) => c.toUpperCase())
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

interface PausaBentoProps {
  articles?: Article[]
}

export default function PausaBento({ articles: initialArticles }: PausaBentoProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'ok' | 'duplicate' | 'error'>('idle')

  const data = (initialArticles?.length ? initialArticles : DEFAULT_ARTICLES) as Article[]
  const featured = data.find((a) => a.featured) ?? data[0]
  const rest = data.filter((a) => a !== featured)
  const card1 = rest[0]
  const card3 = rest[1]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubStatus('loading')
    const supabase = createClient()
    const { error } = await supabase
      .from('suscriptores')
      .insert({ email: email.trim().toLowerCase(), lista: 'pausa' })
    if (!error) {
      setSubStatus('ok')
    } else if (error.code === '23505') {
      setSubStatus('duplicate')
    } else {
      setSubStatus('error')
    }
  }

  return (
    <section className="py-24 md:py-32 px-5" style={{ background: 'var(--eclat-cream)' }}>
      <div className="max-w-6xl mx-auto" ref={ref}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-[#2F7D6B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
              Pausa — Escritos del equipo
            </p>
            <h2
              className="font-bold text-[#0A0A0A] leading-[1.08]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Ideas que cuidan.
            </h2>
            <p className="text-[#6E6E73] mt-2 text-[0.95rem]">
              Reflexiones del equipo ÉCLAT sobre la clínica, el aprendizaje y el desarrollo.
            </p>
          </div>
          <Link
            href="/escritos"
            className="shrink-0 inline-flex items-center gap-1.5 font-semibold text-[14px] text-white px-5 py-2.5 hover:opacity-80 transition-opacity"
            style={{ background: '#0A0A0A', borderRadius: 100 }}
          >
            Ver todos los escritos →
          </Link>
        </motion.div>

        {/* ── Bento Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:1fr_1.8fr] gap-4"
        >

          {/* Card 1 — Clara pequeña */}
          {card1 && (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(47,125,107,0.12)', transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className="group cursor-pointer flex flex-col justify-between gap-4 hover:bg-[#DCEFE8] transition-colors duration-300"
              style={{ background: '#F5F5F7', borderRadius: 20, padding: '2rem' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: '#DCEFE8', color: '#2F7D6B', borderRadius: 100, padding: '4px 12px' }}
                  >
                    {card1.category}
                  </span>
                  <span className="text-[0.75rem]" style={{ color: '#6E6E73' }}>
                    {formatMonth(card1.created_at)}
                  </span>
                </div>
                <h3
                  className="font-semibold text-[#0A0A0A] leading-snug"
                  style={{ fontSize: '1.2rem' }}
                >
                  {card1.title}
                </h3>
              </div>
              <div className="flex justify-end">
                <span className="text-xl font-light transition-transform duration-200 group-hover:translate-x-1" style={{ color: '#2F7D6B' }}>→</span>
              </div>
            </motion.div>
          )}

          {/* Card 2 — Oscura grande con imagen (span 2 rows en desktop) */}
          {featured && (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.28)', transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className="group cursor-pointer relative overflow-hidden lg:[grid-row:span_2]"
              style={{ background: '#0A0A0A', borderRadius: 20, minHeight: 380 }}
            >
              {/* Imagen de fondo */}
              <img
                src={FEATURED_IMAGE}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ opacity: 0.4 }}
                loading="lazy"
              />

              {/* Contenido */}
              <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: '2.5rem', minHeight: 380 }}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: '#2F7D6B', color: 'white', borderRadius: 100, padding: '4px 12px' }}
                    >
                      Destacado
                    </span>
                    <span className="text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {formatMonth(featured.created_at)}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-white leading-[1.15] mb-3"
                    style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', maxWidth: 400 }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', maxWidth: 380 }}
                  >
                    {featured.excerpt}
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Autor */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                      style={{ background: 'rgba(47,125,107,0.6)', color: 'white' }}
                    >
                      É
                    </div>
                    <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Equipo ÉCLAT
                    </span>
                  </div>

                  {/* Botón */}
                  <button
                    className="self-start text-[14px] font-semibold text-white transition-all hover:bg-white/20"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 100,
                      padding: '0.65rem 1.4rem',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    Leer artículo →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Card 3 — Oscura pequeña */}
          {card3 && (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.18)', transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className="group cursor-pointer flex flex-col justify-between gap-4"
              style={{ background: '#1B2B26', borderRadius: 20, padding: '2rem' }}
            >
              <div>
                <span className="text-[0.75rem] block mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {formatMonth(card3.created_at)}
                </span>
                <h3
                  className="font-semibold text-white leading-snug"
                  style={{ fontSize: '1rem' }}
                >
                  {card3.title}
                </h3>
              </div>
              <div className="flex justify-end">
                <span
                  className="text-xl font-light transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: '#B7D8CC' }}
                >
                  →
                </span>
              </div>
            </motion.div>
          )}

          {/* Card 4 — Suscripción (full width) */}
          <motion.div
            variants={cardVariants}
            className="col-span-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            style={{ background: '#DCEFE8', borderRadius: 20, padding: '2rem 3rem' }}
          >
            <div>
              <h3 className="font-bold text-[#0A0A0A]" style={{ fontSize: '1.3rem' }}>
                Recibí Pausa en tu correo
              </h3>
              <p className="mt-1" style={{ color: '#4B6B5E', fontSize: '0.85rem' }}>
                Una vez al mes. Reflexiones, recursos y novedades del equipo ÉCLAT.
              </p>
            </div>

            {subStatus === 'ok' ? (
              <p className="text-[#2F7D6B] font-semibold text-[15px] shrink-0">
                ¡Bienvenido/a a Pausa! 🌿
              </p>
            ) : subStatus === 'duplicate' ? (
              <p className="text-[#4B6B5E] font-semibold text-[15px] shrink-0">
                Ya estás suscripto/a a Pausa.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={subStatus === 'loading'}
                  className="text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2F7D6B]/40 transition-all disabled:opacity-60"
                  style={{
                    background: 'white',
                    border: '1px solid #B7D8CC',
                    borderRadius: 100,
                    padding: '0.7rem 1.2rem',
                    minWidth: 240,
                  }}
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="font-semibold text-white text-[14px] hover:bg-[#245f52] transition-colors disabled:opacity-60"
                  style={{
                    background: '#2F7D6B',
                    borderRadius: 100,
                    padding: '0.7rem 1.6rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {subStatus === 'loading' ? 'Enviando…' : 'Suscribirme'}
                </button>
                {subStatus === 'error' && (
                  <p className="text-red-500 text-[12px] mt-1 w-full">Algo salió mal. Intentá de nuevo.</p>
                )}
              </form>
            )}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
