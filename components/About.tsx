'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'

const spring = { type: 'spring', stiffness: 260, damping: 24 }

interface AboutProps {
  siteConfig?: Record<string, string>
}

export default function About({ siteConfig: initialConfig }: AboutProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isDirector = useDirector()
  const [editing, setEditing] = useState(false)
  const [config, setConfig] = useState(initialConfig ?? {})

  const title = config.about_title ?? 'Un centro pensado para cada persona.'
  const body = config.about_body ?? 'Centro de Atención Integral reconocido y habilitado por el Ministerio de Desarrollo Social, registrado en el Registro Nacional de Prestadores de la Superintendencia de Servicios de Salud.'
  const quote = config.about_quote ?? 'Una sociedad inclusiva reconoce y celebra la diversidad, promoviendo la igualdad de oportunidades.'
  const mision = config.about_mision ?? 'Potenciar la calidad de vida promoviendo el bienestar emocional, la salud mental y la diversidad.'
  const valores = config.about_valores ?? 'Contención, calidez, confianza y respeto. Un lugar donde cada persona se siente valorada.'
  const enfoque = config.about_enfoque ?? 'Mirada singular centrada en las necesidades, deseos y capacidades de cada persona.'
  const teamImage = config.about_team_image ?? ''

  const columns = [
    { title: 'Misión', body: mision, icon: '◎' },
    { title: 'Valores', body: valores, icon: '◈' },
    { title: 'Enfoque', body: enfoque, icon: '◇' },
  ]

  const fields: EditField[] = [
    { key: 'about_title', label: 'Título', type: 'text', value: title },
    { key: 'about_body', label: 'Texto de habilitación', type: 'textarea', rows: 3, value: body },
    { key: 'about_mision', label: 'Columna Misión', type: 'textarea', rows: 3, value: mision },
    { key: 'about_valores', label: 'Columna Valores', type: 'textarea', rows: 3, value: valores },
    { key: 'about_enfoque', label: 'Columna Enfoque', type: 'textarea', rows: 3, value: enfoque },
    { key: 'about_team_image', label: 'Foto del equipo', type: 'image', value: teamImage, hint: 'Subí la foto del equipo' },
    { key: 'about_quote', label: 'Cita destacada', type: 'textarea', rows: 2, value: quote },
  ]

  const saveConfig = async (data: Record<string, string>) => {
    const supabase = createClient()
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        supabase.from('site_config').upsert({ key, value, updated_at: new Date().toISOString() })
      )
    )
    setConfig(c => ({ ...c, ...data }))
  }

  return (
    <section id="sobre" className="py-24 md:py-32 px-5 bg-[#F5F5F7] overflow-hidden relative">
      {isDirector && (
        <div className="absolute top-4 right-4 z-10">
          <EditBtn onClick={() => setEditing(true)} label="Editar sección" variant="section" />
        </div>
      )}

      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-[#2F7D6B] text-[12px] font-semibold tracking-[0.2em] uppercase mb-5">Sobre ÉCLAT</motion.p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">
          <motion.h2 initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...spring, delay: 0.1 }}
            className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.06]">
            {title}
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center">
            <p className="text-[16px] md:text-[17px] text-[#424245] leading-relaxed mb-5">{body}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F7D6B]" />
              <span className="text-[13px] font-medium text-[#2F7D6B]">Habilitado por el Ministerio de Desarrollo Social</span>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {columns.map((col, i) => (
            <motion.div key={col.title} initial={{ opacity: 0, y: 32, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ ...spring, delay: 0.15 + i * 0.1 }} whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl md:rounded-3xl p-7 border border-black/[0.06] shadow-sm cursor-default">
              <span className="text-2xl text-[#2F7D6B] block mb-4">{col.icon}</span>
              <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#2F7D6B] mb-3">{col.title}</h3>
              <p className="text-[14px] md:text-[15px] text-[#424245] leading-relaxed">{col.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Foto del equipo */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...spring, delay: 0.4 }}
          className="w-full rounded-2xl md:rounded-3xl overflow-hidden h-56 md:h-72 flex flex-col items-center justify-center gap-4 mb-14 relative group">
          {teamImage ? (
            <img src={teamImage} alt="Equipo ÉCLAT" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#DCEFE8] to-[#b8ddd0] flex flex-col items-center justify-center gap-4 relative">
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 50%, #2F7D6B 0%, transparent 70%)' }} />
              <div className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p className="text-[13px] font-semibold text-[#2F7D6B]">Foto del equipo</p>
              </div>
            </div>
          )}
          {isDirector && (
            <div className="absolute top-3 right-3">
              <EditBtn onClick={() => setEditing(true)} label="Subir foto" variant="section" />
            </div>
          )}
        </motion.div>

        <motion.blockquote initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...spring, delay: 0.5 }}
          className="border-l-[3px] border-[#2F7D6B] pl-7 py-2">
          <p className="text-[clamp(1.1rem,2.5vw,1.45rem)] font-light leading-relaxed text-[#0A0A0A] mb-3">"{quote}"</p>
          <cite className="text-[13px] text-[#86868b] not-italic">— Centro ÉCLAT</cite>
        </motion.blockquote>
      </div>

      <EditDrawer isOpen={editing} title="Editar Sobre ÉCLAT" fields={fields} onSave={saveConfig} onClose={() => setEditing(false)} />
    </section>
  )
}
