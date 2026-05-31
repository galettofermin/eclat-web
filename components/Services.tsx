'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Service } from '@/lib/types'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const illustrations: Record<string, React.ReactNode> = {
  'Psicología': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="32" cy="22" r="14" stroke="currentColor" strokeWidth="2"/><path d="M26 20c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.5-1.5 4.6-3.7 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="32" cy="22" r="3" fill="currentColor" opacity=".3"/><path d="M20 44c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  'Psicopedagogía': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><rect x="12" y="18" width="28" height="34" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M12 28h28" stroke="currentColor" strokeWidth="1.5"/><path d="M18 23h10M18 34h16M18 39h12M18 44h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="46" cy="22" r="8" stroke="currentColor" strokeWidth="2"/><path d="M44 22l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  'Fonoaudiología': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><rect x="24" y="8" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M16 30c0 8.8 7.2 16 16 16s16-7.2 16-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="32" y1="46" x2="32" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="24" y1="54" x2="40" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  'Psicomotricidad': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="32" cy="12" r="6" stroke="currentColor" strokeWidth="2"/><path d="M32 18v14M32 24l-10 8M32 24l10 8M22 32l-6 14M42 32l6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  'Arteterapia': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2"/><circle cx="22" cy="26" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="42" cy="26" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="22" cy="42" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="42" cy="42" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="32" cy="32" r="4" fill="currentColor" opacity=".3"/></svg>),
  'Docente de Apoyo': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="22" cy="18" r="8" stroke="currentColor" strokeWidth="2"/><path d="M8 48c0-7.7 6.3-14 14-14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="44" cy="26" r="6" stroke="currentColor" strokeWidth="2"/><path d="M34 48c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  'Taller de Habilidades Sociales': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="2"/><circle cx="14" cy="36" r="6" stroke="currentColor" strokeWidth="2"/><circle cx="50" cy="36" r="6" stroke="currentColor" strokeWidth="2"/><path d="M26 18l-8 12M38 18l8 12M20 42l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  'Evaluaciones Diagnósticas': (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><rect x="14" y="10" width="36" height="44" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M22 10v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/><path d="M22 26l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 38h20M22 44h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
}
const FALLBACK_ICON = (<svg viewBox="0 0 64 64" fill="none" className="w-full h-full"><circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2"/></svg>)
const DARK_TITLES = new Set(['Psicología','Psicomotricidad','Arteterapia','Evaluaciones Diagnósticas'])

const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { title:'Psicología', description:'Evaluación, diagnóstico y acompañamiento terapéutico para niños, adolescentes y adultos.', sort_order:1, published:true },
  { title:'Psicopedagogía', description:'Abordaje de las dificultades de aprendizaje con estrategias adaptadas a cada estudiante.', sort_order:2, published:true },
  { title:'Fonoaudiología', description:'Tratamiento del lenguaje, la comunicación, la voz, la deglución y la audición.', sort_order:3, published:true },
  { title:'Psicomotricidad', description:'Desarrollo motor y emocional a través del movimiento y el juego.', sort_order:4, published:true },
  { title:'Arteterapia', description:'El proceso creativo como medio de expresión, autoconocimiento y crecimiento personal.', sort_order:5, published:true },
  { title:'Docente de Apoyo', description:'Acompañamiento en trayectorias educativas en colaboración con familias e instituciones.', sort_order:6, published:true },
  { title:'Taller de Habilidades Sociales', description:'Espacios grupales semanales con enfoque interdisciplinario para niños y adolescentes.', sort_order:7, published:true },
  { title:'Evaluaciones Diagnósticas', description:'Evaluaciones integrales para orientar el plan terapéutico de cada persona.', sort_order:8, published:true },
]

const containerVariants = { hidden:{}, visible:{ transition:{ staggerChildren:0.07 } } }
const cardVariants = { hidden:{ opacity:0, y:40, scale:0.96 }, visible:{ opacity:1, y:0, scale:1, transition:{ type:'spring', stiffness:260, damping:24 } } }

interface ServicesProps {
  services?: Service[]
  siteConfig?: Record<string, string>
}

export default function Services({ services: initialServices, siteConfig }: ServicesProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const isDirector = useDirector()
  const router = useRouter()
  const [items, setItems] = useState<(Service | Omit<Service,'id'>)[]>(initialServices ?? DEFAULT_SERVICES)
  const [editItem, setEditItem] = useState<Service | null>(null)
  const [addingNew, setAddingNew] = useState(false)

  const title = siteConfig?.services_title ?? 'Lo que hacemos.'
  const subtitle = siteConfig?.services_subtitle ?? 'Un equipo interdisciplinario para acompañar el desarrollo, el aprendizaje y la salud mental en cada etapa de la vida.'

  const getFields = (s?: Service): EditField[] => [
    { key: 'title', label: 'Nombre del servicio', type: 'text', value: s?.title ?? '' },
    { key: 'description', label: 'Descripción', type: 'textarea', rows: 3, value: s?.description ?? '' },
  ]

  const handleSave = async (data: Record<string, string>) => {
    const supabase = createClient()
    if (editItem?.id) {
      await supabase.from('services').update({ title: data.title, description: data.description }).eq('id', editItem.id)
      setItems(prev => prev.map(s => (s as Service).id === editItem.id ? { ...s, ...data } : s))
    } else {
      const { data: newS } = await supabase.from('services')
        .insert({ title: data.title, description: data.description, sort_order: items.length + 1, published: true })
        .select().single()
      if (newS) setItems(prev => [...prev, newS])
    }
    setEditItem(null)
    setAddingNew(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!editItem?.id) return
    const supabase = createClient()
    await supabase.from('services').delete().eq('id', editItem.id)
    setItems(prev => prev.filter(s => (s as Service).id !== editItem.id))
    setEditItem(null)
    router.refresh()
  }

  return (
    <section id="servicios" className="py-24 md:py-32 px-5 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-14 md:mb-20">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-[#2F7D6B] text-[12px] font-semibold tracking-[0.2em] uppercase mb-4">Servicios</motion.p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
              className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.05] max-w-xl">{title}</motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[16px] text-[#6E6E73] max-w-sm leading-relaxed md:text-right">{subtitle}</motion.p>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((service, i) => {
            const isDark = DARK_TITLES.has(service.title)
            const illustration = illustrations[service.title] ?? FALLBACK_ICON
            const sid = (service as Service).id

            return (
              <motion.div key={sid ?? service.title} variants={cardVariants} whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type:'spring', stiffness:400, damping:25 }}
                className={`relative rounded-2xl md:rounded-3xl p-5 md:p-7 flex flex-col gap-4 overflow-hidden group ${isDark ? 'bg-[#1e5c50] text-white' : 'bg-[#F5F5F7] text-[#0A0A0A]'}`}>
                <div className="absolute inset-0 opacity-30" style={{ background: isDark ? 'radial-gradient(circle at 80% 20%, rgba(100,200,170,0.3) 0%, transparent 60%)' : 'radial-gradient(circle at 20% 80%, rgba(47,125,107,0.08) 0%, transparent 60%)' }} />
                <div className={`relative w-12 h-12 md:w-14 md:h-14 ${isDark ? 'text-white/80' : 'text-[#2F7D6B]'}`}>
                  {illustration}
                </div>
                <div className="relative flex-1 flex flex-col gap-2">
                  <h3 className={`text-[14px] md:text-[16px] font-semibold leading-snug ${isDark ? 'text-white' : 'text-[#0A0A0A]'}`}>{service.title}</h3>
                  <p className={`text-[12px] md:text-[13px] leading-relaxed ${isDark ? 'text-white/65' : 'text-[#6E6E73]'}`}>{service.description}</p>
                </div>
                <div className={`relative w-7 h-7 rounded-full flex items-center justify-center self-end ${isDark ? 'bg-white/15' : 'bg-[#2F7D6B]/10'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'white' : '#2F7D6B'} strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </div>

                {/* Director controls */}
                {isDirector && sid && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                    <EditBtn onClick={() => setEditItem(service as Service)} variant="item" />
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Add new service button - only for director */}
          {isDirector && (
            <motion.div variants={cardVariants}
              className="rounded-2xl md:rounded-3xl border-2 border-dashed border-[#2F7D6B]/30 flex items-center justify-center cursor-pointer hover:border-[#2F7D6B]/60 hover:bg-[#DCEFE8]/20 transition-colors min-h-[160px]"
              onClick={() => { setEditItem(null); setAddingNew(true) }}>
              <div className="text-center">
                <div className="text-3xl text-[#2F7D6B]/60 mb-2">+</div>
                <p className="text-[13px] font-medium text-[#2F7D6B]/60">Agregar servicio</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#F5F5F7] rounded-2xl md:rounded-3xl px-7 py-6">
          <div>
            <p className="text-[17px] font-semibold text-[#0A0A0A]">¿No sabés por dónde empezar?</p>
            <p className="text-[14px] text-[#6E6E73] mt-0.5">Escribinos y te orientamos sin compromiso.</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[14px] hover:bg-[#245f52] transition-colors shadow-lg shadow-[#2F7D6B]/20">
            Consultar ahora
          </a>
        </motion.div>
      </div>

      {/* Edit existing service */}
      <EditDrawer
        isOpen={!!editItem && !addingNew}
        title={`Editar: ${editItem?.title ?? ''}`}
        fields={getFields(editItem ?? undefined)}
        onSave={handleSave}
        onClose={() => setEditItem(null)}
        onDelete={handleDelete}
        deleteLabel="Eliminar servicio"
      />

      {/* Add new service */}
      <EditDrawer
        isOpen={addingNew}
        title="Nuevo servicio"
        fields={getFields()}
        onSave={handleSave}
        onClose={() => setAddingNew(false)}
      />
    </section>
  )
}
