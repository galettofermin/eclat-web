'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { INSTAGRAM_URL } from '@/lib/constants'
import type { Article } from '@/lib/types'

const DEFAULT_ARTICLES: Partial<Article>[] = [
  { title: 'Cuerpo, voz y palabra: tres modos de estar en el mundo', category: 'Clínica', excerpt: 'El cuerpo, la voz y la palabra no son simplemente herramientas de comunicación. Son modos de existir, de ocupar lugar, de dejarse ver y escuchar.', read_time: '6 min', featured: true },
  { title: 'El lugar de la escucha en el trabajo con niños', category: 'Infancia', excerpt: 'Escuchar a un niño no es solo prestarle atención. Es abrir un espacio donde lo que trae pueda tener lugar, forma y sentido.', read_time: '5 min', featured: false },
  { title: '¿Qué es una dificultad de aprendizaje? Más allá del diagnóstico', category: 'Aprendizaje', excerpt: 'Reducir las dificultades de aprendizaje a un rótulo diagnóstico puede dejar afuera lo más importante: la singularidad de cada proceso.', read_time: '7 min', featured: false },
  { title: 'La voz como presencia: reflexiones desde la fonoaudiología', category: 'Fonoaudiología', excerpt: 'La voz no es solo sonido. Es presencia, identidad, vínculo. Una reflexión sobre lo que está en juego cuando alguien pierde o encuentra su voz.', read_time: '5 min', featured: false },
  { title: 'El juego no es solo jugar', category: 'Psicomotricidad', excerpt: 'Para el niño, el juego es trabajo serio. Es el espacio donde procesa, elabora, aprende y se construye.', read_time: '4 min', featured: false },
  { title: 'Trabajar con otros: notas sobre la interdisciplina', category: 'Interdisciplina', excerpt: 'La interdisciplina no es un método ni una técnica. Es una postura frente al conocimiento y frente al otro.', read_time: '6 min', featured: false },
]

interface EscritosProps {
  articles?: Article[]
  siteConfig?: Record<string, string>
}

export default function Escritos({ articles, siteConfig }: EscritosProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const data = articles ?? DEFAULT_ARTICLES
  const featured = data.find((a) => a.featured) ?? data[0]
  const rest = data.filter((a) => a !== featured)

  const title = siteConfig?.escritos_title ?? 'Ideas que cuidan.'
  const subtitle = siteConfig?.escritos_subtitle ?? 'Artículos y reflexiones del equipo ÉCLAT para familias, docentes y profesionales.'
  const newsletterTitle = siteConfig?.newsletter_title ?? 'Recibí los escritos en tu correo'
  const newsletterSubtitle = siteConfig?.newsletter_subtitle ?? 'Te avisamos cuando publicamos nuevos artículos y materiales.'

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <section id="escritos" className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div ref={ref}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-[#2F7D6B] text-[13px] font-semibold tracking-widest uppercase mb-4">Escritos</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight mb-4 max-w-2xl">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} className="text-[17px] text-[#6E6E73] mb-16 max-w-xl">{subtitle}</motion.p>
        </div>

        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group mb-8 p-10 rounded-3xl bg-[#F5F5F7] border border-black/5 hover:border-[#2F7D6B]/30 hover:bg-[#DCEFE8]/30 transition-all cursor-pointer"
          >
            <span className="inline-block bg-[#DCEFE8] text-[#2F7D6B] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-5">{featured.category}</span>
            <h3 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold text-[#0A0A0A] mb-4 leading-snug group-hover:text-[#2F7D6B] transition-colors">{featured.title}</h3>
            <p className="text-[16px] text-[#6E6E73] leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center gap-4">
              <span className="text-[13px] text-[#86868b]">{featured.read_time} de lectura</span>
              <span className="text-[13px] font-medium text-[#2F7D6B]">Leer artículo →</span>
            </div>
          </motion.article>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {rest.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group p-7 rounded-2xl border border-black/[0.07] hover:border-[#2F7D6B]/30 hover:bg-[#F5F5F7] transition-all cursor-pointer flex flex-col"
            >
              <span className="inline-block bg-[#F5F5F7] text-[#6E6E73] text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full mb-4 w-fit">{article.category}</span>
              <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-3 leading-snug group-hover:text-[#2F7D6B] transition-colors flex-1">{article.title}</h3>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed mb-4">{article.excerpt}</p>
              <span className="text-[12px] text-[#86868b]">{article.read_time} de lectura</span>
            </motion.article>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.6 }} className="bg-[#F5F5F7] rounded-3xl p-10 text-center">
          <h3 className="text-[22px] font-semibold text-[#0A0A0A] mb-3">{newsletterTitle}</h3>
          <p className="text-[15px] text-[#6E6E73] mb-8 max-w-sm mx-auto">{newsletterSubtitle}</p>
          {subscribed ? (
            <p className="text-[#2F7D6B] font-semibold text-[16px]">¡Gracias! Te tenemos en cuenta.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="flex-1 px-5 py-3 rounded-full border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white" />
              <button type="submit" className="px-6 py-3 bg-[#2F7D6B] text-white font-semibold rounded-full text-[15px] hover:bg-[#245f52] transition-colors">Suscribirse</button>
            </form>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.7 }} className="mt-10 text-center">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#6E6E73] hover:text-[#2F7D6B] font-medium text-[15px] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            Más contenido en @eclatcentro
          </a>
        </motion.div>
      </div>
    </section>
  )
}
