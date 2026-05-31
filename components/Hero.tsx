'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const serviceChips = [
  'Psicología', 'Psicopedagogía', 'Fonoaudiología', 'Psicomotricidad',
  'Arteterapia', 'Docente de Apoyo', 'Habilidades Sociales', 'Evaluaciones',
]

interface HeroProps {
  siteConfig?: Record<string, string>
}

export default function Hero({ siteConfig }: HeroProps) {
  const rawTitle = siteConfig?.hero_title ?? 'Cuerpo, voz y palabra. Un lugar para cada uno.'
  const subtitle = siteConfig?.hero_subtitle ?? 'Un espacio donde cada persona es escuchada en su singularidad. Acompañamos el desarrollo de niños, adolescentes y adultos desde una mirada que hace lugar a cada uno.'
  const quote = siteConfig?.hero_quote ?? 'Acompañamos a cada persona a encontrar su propio brillo, desde un lugar de respeto, profesionalismo y calidez humana.'
  const ctaTitle = siteConfig?.cta_title ?? '¿Querés saber si podemos ayudarte?'
  const ctaSubtitle = siteConfig?.cta_subtitle ?? 'Escribinos por WhatsApp y te respondemos a la brevedad.'

  const dotIdx = rawTitle.indexOf('.')
  const titlePart1 = dotIdx >= 0 ? rawTitle.slice(0, dotIdx + 1) : rawTitle
  const titlePart2 = dotIdx >= 0 ? rawTitle.slice(dotIdx + 1).trim() : ''

  return (
    <>
      {/* ── Hero ── */}
      <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-5 pt-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(47,125,107,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-[#DCEFE8] text-[#2F7D6B] text-[12px] font-semibold px-4 py-1.5 rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6B] animate-pulse" />
                Centro interdisciplinario de salud y educación
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.2rem,7vw,4rem)] font-semibold leading-[1.06] tracking-tight text-[#0A0A0A] mb-5"
              >
                {titlePart1}
                {titlePart2 && <><br /><span className="text-[#2F7D6B]">{titlePart2}</span></>}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[16px] md:text-[17px] text-[#6E6E73] leading-relaxed mb-8 max-w-lg"
              >
                {subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] md:text-[16px] px-7 py-3.5 rounded-full hover:bg-[#245f52] active:scale-95 transition-all shadow-lg shadow-[#2F7D6B]/20"
                >
                  {WA_ICON}
                  Reservar turno
                </a>
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center bg-white text-[#0A0A0A] border border-black/10 font-semibold text-[15px] md:text-[16px] px-7 py-3.5 rounded-full hover:bg-black/5 active:scale-95 transition-all"
                >
                  Conocer servicios
                </Link>
              </motion.div>
            </div>

            {/* REEMPLAZAR CON FOTO REAL del espacio */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
            >
              <div className="aspect-[4/3] rounded-3xl bg-[#F5F5F7] border border-black/5 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#DCEFE8] flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                </div>
                <p className="text-[13px] text-[#6E6E73] font-medium">Foto del espacio</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} className="w-5 h-8 rounded-full border border-black/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-black/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Chips de servicios ── */}
      <section className="py-14 md:py-20 px-5 bg-[#F5F5F7]">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center text-[12px] text-[#6E6E73] font-medium uppercase tracking-widest mb-6">
            Nuestros servicios
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {serviceChips.map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white rounded-2xl px-4 py-3.5 border border-black/5 text-[13px] md:text-[14px] font-medium text-[#1d1d1f] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6B] shrink-0" />
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Frase destacada ── */}
      <section className="py-20 md:py-28 px-5 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[clamp(1.3rem,3.5vw,2.2rem)] font-light leading-relaxed text-[#0A0A0A] tracking-tight mb-4">
              "{quote}"
            </p>
            <span className="text-[13px] text-[#6E6E73]">— Equipo ÉCLAT</span>
          </motion.div>
        </div>
      </section>

      {/* ── CTA negro ── */}
      <section className="px-5 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0A0A0A] rounded-2xl md:rounded-3xl px-7 md:px-10 py-12 md:py-16 text-center text-white">
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-semibold tracking-tight mb-3">{ctaTitle}</h2>
            <p className="text-white/60 text-[15px] md:text-[17px] mb-8 max-w-md mx-auto leading-relaxed">{ctaSubtitle}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-semibold text-[15px] md:text-[16px] px-7 py-3.5 rounded-full hover:bg-white/90 active:scale-95 transition-all">
              {WA_ICON}
              Reservar turno
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
