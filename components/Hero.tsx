'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import LogoImage from './LogoImage'
import { WHATSAPP_URL } from '@/lib/constants'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'

const WA_ICON = (<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>)

const spring = { type: 'spring', stiffness: 300, damping: 28 }

const serviceChips = ['Psicología','Psicopedagogía','Fonoaudiología','Psicomotricidad','Arteterapia','Docente de Apoyo','Habilidades Sociales','Evaluaciones']

interface HeroProps {
  siteConfig?: Record<string, string>
}

export default function Hero({ siteConfig: initialConfig }: HeroProps) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -60])
  const isDirector = useDirector()
  const [editSection, setEditSection] = useState<'hero' | 'quote' | 'cta' | 'photo' | null>(null)
  const [config, setConfig] = useState(initialConfig ?? {})

  const title = config.hero_title ?? 'Cuerpo, voz y palabra. Un lugar para cada uno.'
  const subtitle = config.hero_subtitle ?? 'Un espacio donde cada persona es escuchada en su singularidad. Acompañamos el desarrollo de niños, adolescentes y adultos desde una mirada que hace lugar a cada uno.'
  const quote = config.hero_quote ?? 'Acompañamos a cada persona a encontrar su propio brillo, desde un lugar de respeto, profesionalismo y calidez humana.'
  const ctaTitle = config.cta_title ?? '¿Querés saber si podemos ayudarte?'
  const ctaSubtitle = config.cta_subtitle ?? 'Escribinos por WhatsApp y te respondemos a la brevedad.'
  const heroImage = config.hero_image ?? ''

  const dotIdx = title.indexOf('.')
  const part1 = dotIdx >= 0 ? title.slice(0, dotIdx + 1) : title
  const part2 = dotIdx >= 0 ? title.slice(dotIdx + 1).trim() : ''

  const saveConfig = async (data: Record<string, string>) => {
    const supabase = createClient()
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        supabase.from('site_config').upsert({ key, value, updated_at: new Date().toISOString() })
      )
    )
    setConfig(c => ({ ...c, ...data }))
  }

  const heroFields: EditField[] = [
    { key: 'hero_title', label: 'Slogan principal', type: 'text', value: title },
    { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 3, value: subtitle },
    { key: 'hero_image', label: 'Foto del espacio', type: 'image', value: heroImage, hint: 'Subí la foto real del espacio' },
  ]

  const quoteFields: EditField[] = [
    { key: 'hero_quote', label: 'Frase destacada', type: 'textarea', rows: 3, value: quote },
  ]

  const ctaFields: EditField[] = [
    { key: 'cta_title', label: 'Título del bloque negro', type: 'text', value: ctaTitle },
    { key: 'cta_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, value: ctaSubtitle },
  ]

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white px-5 pt-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1,1.08,1], opacity: [0.06,0.1,0.06] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, #2F7D6B 0%, transparent 70%)' }} />
          <motion.div animate={{ scale: [1,1.12,1], opacity: [0.04,0.07,0.04] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, #2F7D6B 0%, transparent 70%)' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-[#DCEFE8] text-[#2F7D6B] text-[12px] font-semibold px-4 py-1.5 rounded-full mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D6B] animate-pulse" />
                Centro interdisciplinario de salud y educación
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.18 }}
                className="text-[clamp(2.4rem,7vw,4.2rem)] font-semibold leading-[1.04] tracking-tight text-[#0A0A0A] mb-6">
                {part1}{part2 && <><br /><span className="text-[#2F7D6B]">{part2}</span></>}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.26 }}
                className="text-[16px] md:text-[17px] text-[#6E6E73] leading-relaxed mb-9 max-w-md">
                {subtitle}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.34 }}
                className="flex flex-col sm:flex-row gap-3">
                <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                  className="inline-flex items-center justify-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[15px] px-7 py-3.5 rounded-full shadow-xl shadow-[#2F7D6B]/25 hover:bg-[#245f52] transition-colors">
                  {WA_ICON} Reservar turno
                </motion.a>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
                  <Link href="/servicios" className="inline-flex items-center justify-center bg-white text-[#0A0A0A] border border-black/10 font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#F5F5F7] transition-colors w-full sm:w-auto">
                    Conocer servicios
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Foto */}
            <motion.div initial={{ opacity: 0, scale: 0.92, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ ...spring, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-4">
              <div className="aspect-[5/4] rounded-3xl overflow-hidden relative group">
                {heroImage ? (
                  <img src={heroImage} alt="Espacio ÉCLAT" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#DCEFE8] to-[#b8ddd0] flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    </div>
                    <p className="text-[13px] font-medium text-[#2F7D6B]">Foto del espacio</p>
                  </div>
                )}
                {isDirector && (
                  <div className="absolute top-3 right-3">
                    <EditBtn onClick={() => setEditSection('hero')} label="Editar foto" variant="section" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ n:'8', label:'Especialidades' },{ n:'+', label:'Servicios integrales' },{ n:'100%', label:'Habilitado' }].map(stat => (
                  <div key={stat.label} className="bg-[#F5F5F7] rounded-2xl p-4 text-center">
                    <p className="text-[22px] font-bold text-[#2F7D6B]">{stat.n}</p>
                    <p className="text-[11px] text-[#6E6E73] leading-tight mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Edit button hero text */}
        {isDirector && (
          <div className="absolute top-20 right-5 z-20">
            <EditBtn onClick={() => setEditSection('hero')} label="Editar hero" variant="section" />
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0,8,0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-black/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-black/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* Chips */}
      <section className="py-14 md:py-20 px-5 bg-[#F5F5F7]">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-[11px] text-[#86868b] font-semibold uppercase tracking-[0.2em] mb-7">Áreas de atención</motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {serviceChips.map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 16, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.04 }} whileHover={{ y: -2, scale: 1.02 }}
                className="bg-white rounded-2xl px-4 py-3.5 border border-black/[0.06] text-[13px] font-medium text-[#1d1d1f] flex items-center gap-2.5 shadow-sm cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#2F7D6B] shrink-0" />{s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frase destacada */}
      <section className="py-20 md:py-28 px-5 bg-white overflow-hidden relative">
        {isDirector && (
          <div className="absolute top-4 right-4 z-10">
            <EditBtn onClick={() => setEditSection('quote')} label="Editar frase" variant="section" />
          </div>
        )}
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}>
            <p className="text-[clamp(1.4rem,3.8vw,2.4rem)] font-light leading-[1.4] text-[#0A0A0A] tracking-tight mb-5">"{quote}"</p>
            <span className="text-[13px] text-[#86868b]">— Equipo ÉCLAT</span>
          </motion.div>
        </div>
      </section>

      {/* CTA negro */}
      <section className="px-5 pb-20 md:pb-28 relative">
        {isDirector && (
          <div className="absolute top-2 right-6 z-10">
            <EditBtn onClick={() => setEditSection('cta')} label="Editar CTA" variant="section" />
          </div>
        )}
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="bg-[#0A0A0A] rounded-2xl md:rounded-3xl px-8 md:px-14 py-12 md:py-16 text-white overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #2F7D6B 0%, transparent 70%)' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-lg">
                <h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold tracking-tight leading-tight mb-3">{ctaTitle}</h2>
                <p className="text-white/55 text-[16px] leading-relaxed">{ctaSubtitle}</p>
              </div>
              <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={spring}
                className="shrink-0 inline-flex items-center gap-2.5 bg-white text-[#0A0A0A] font-semibold text-[15px] px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors shadow-xl">
                {WA_ICON} Escribinos
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Drawers */}
      <EditDrawer
        isOpen={editSection === 'hero'}
        title="Editar Hero"
        fields={heroFields}
        onSave={saveConfig}
        onClose={() => setEditSection(null)}
      />
      <EditDrawer
        isOpen={editSection === 'quote'}
        title="Editar frase destacada"
        fields={quoteFields}
        onSave={saveConfig}
        onClose={() => setEditSection(null)}
      />
      <EditDrawer
        isOpen={editSection === 'cta'}
        title="Editar bloque negro"
        fields={ctaFields}
        onSave={saveConfig}
        onClose={() => setEditSection(null)}
      />
    </>
  )
}
