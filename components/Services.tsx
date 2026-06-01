'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { WHATSAPP_URL } from '@/lib/constants'
import type { Service } from '@/lib/types'
import { useDirector } from '@/hooks/useDirector'
import EditDrawer, { EditField } from './admin/EditDrawer'
import EditBtn from './admin/EditBtn'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SERVICE_IMAGES: Record<string, string> = {
  'Psicopedagogía': '/servicios/27.png',
  'Psicología': '/servicios/28.png',
  'Fonoaudiología': '/servicios/29.png',
  'Psicomotricidad': '/servicios/30.png',
  'Docente de Apoyo': '/servicios/31.png',
  'Arteterapia': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
  'Taller de Habilidades Sociales': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
  'Evaluaciones Diagnósticas': 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600',
}

const LOGO_URL = 'https://lh3.googleusercontent.com/sitesv/AA5AbUCZUiL0tTD-v65ZhPjiQ07I58VQWwOp43zM5q8G9Qy4FEufLl5szqe2gQwsLo0vR3arFNG6PPzqR1c_ClUQ2B-HbA6_4b15xflv-R5o-wUISqZatdtbXiW5UPQqoDa9mWO5yWe4Ji5_6kIvavUwFQQumZAGam96xnpRZM6eVI-_w2JMgRn0MJ91WI4=w400'

const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  { title: 'Psicología', description: 'Evaluación, diagnóstico y <strong>acompañamiento terapéutico</strong> para niños, adolescentes y adultos.', sort_order: 1, published: true },
  { title: 'Psicopedagogía', description: 'Abordaje de las <strong>dificultades de aprendizaje</strong> con estrategias adaptadas a cada estudiante.', sort_order: 2, published: true },
  { title: 'Fonoaudiología', description: 'Tratamiento del <strong>lenguaje, la comunicación</strong>, la voz, la deglución y la audición.', sort_order: 3, published: true },
  { title: 'Psicomotricidad', description: '<strong>Desarrollo motor y emocional</strong> a través del movimiento y el juego.', sort_order: 4, published: true },
  { title: 'Arteterapia', description: 'El <strong>proceso creativo</strong> como medio de expresión, autoconocimiento y crecimiento personal.', sort_order: 5, published: true },
  { title: 'Docente de Apoyo', description: '<strong>Acompañamiento en trayectorias educativas</strong> en colaboración con familias e instituciones.', sort_order: 6, published: true },
  { title: 'Taller de Habilidades Sociales', description: 'Espacios grupales semanales con <strong>enfoque interdisciplinario</strong> para niños y adolescentes.', sort_order: 7, published: true },
  { title: 'Evaluaciones Diagnósticas', description: 'Evaluaciones integrales para <strong>orientar el plan terapéutico</strong> de cada persona.', sort_order: 8, published: true },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

interface ServicesProps {
  services?: Service[]
  siteConfig?: Record<string, string>
}

export default function Services({ services: initialServices, siteConfig }: ServicesProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const isDirector = useDirector()
  const router = useRouter()
  const [items, setItems] = useState<(Service | Omit<Service, 'id'>)[]>(initialServices ?? DEFAULT_SERVICES)
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
    <section id="servicios" className="py-24 md:py-32 px-5 bg-[#F5F9F7] relative">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={ref} className="mb-14 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-[#2F7D6B] text-[12px] font-semibold tracking-[0.2em] uppercase mb-4"
          >
            Servicios
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.2rem,5vw,3.8rem)] font-semibold tracking-tight text-[#0A0A0A] leading-[1.05] max-w-xl"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[16px] text-[#6E6E73] max-w-sm leading-relaxed md:text-right"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        {/* Grid de cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((service) => {
            const sid = (service as Service).id
            const coverImage = SERVICE_IMAGES[service.title]

            return (
              <motion.div
                key={sid ?? service.title}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  boxShadow: '0 16px 48px rgba(47,125,107,0.22)',
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                className="group relative flex flex-col bg-white overflow-hidden"
                style={{
                  border: '3px solid #B7D8CC',
                  borderRadius: 24,
                  boxShadow: '0 4px 20px rgba(47,125,107,0.10)',
                }}
              >
                {/* Imagen */}
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{ height: 220, borderRadius: '18px 18px 0 0' }}
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#DCEFE8] to-[#B7D8CC] flex items-center justify-center">
                      <span className="text-[#2F7D6B] text-5xl font-black opacity-20">
                        {service.title[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido de texto */}
                <div className="flex flex-col flex-1" style={{ padding: '1.2rem 1.5rem' }}>

                  {/* Etiqueta "SERVICIO DE:" con barra rosada */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      style={{
                        width: 4,
                        alignSelf: 'stretch',
                        background: '#E8607A',
                        borderRadius: 2,
                        flexShrink: 0,
                        minHeight: '1rem',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: '#4B6B5E',
                        textTransform: 'uppercase',
                      }}
                    >
                      SERVICIO DE:
                    </span>
                  </div>

                  {/* Nombre del servicio */}
                  <h3
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#1B2B26',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Línea separadora */}
                  <div style={{ borderTop: '1px solid #DCEFE8', margin: '0.8rem 0' }} />

                  {/* Descripción con palabras clave en verde */}
                  <p
                    className="flex-1 [&_strong]:text-[#2F7D6B] [&_strong]:font-semibold"
                    style={{ fontSize: '0.9rem', color: '#4B6B5E', lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />

                  {/* Logo al pie */}
                  <div className="flex justify-center mt-4" style={{ paddingBottom: '0.5rem' }}>
                    <img
                      src={LOGO_URL}
                      alt="ÉCLAT"
                      style={{ height: 44, objectFit: 'contain' }}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Controles director */}
                {isDirector && sid && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditBtn onClick={() => setEditItem(service as Service)} variant="item" />
                  </div>
                )}
              </motion.div>
            )
          })}

          {/* Botón agregar — solo director */}
          {isDirector && (
            <motion.div
              variants={cardVariants}
              className="flex items-center justify-center cursor-pointer hover:bg-[#DCEFE8]/30 transition-colors min-h-[420px]"
              style={{ border: '3px dashed #B7D8CC', borderRadius: 24 }}
              onClick={() => { setEditItem(null); setAddingNew(true) }}
            >
              <div className="text-center">
                <div className="text-4xl text-[#2F7D6B]/50 mb-2">+</div>
                <p className="text-[13px] font-medium text-[#2F7D6B]/60">Agregar servicio</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA inferior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 md:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl md:rounded-3xl px-7 py-6"
          style={{ background: '#fff', border: '2px solid #B7D8CC', boxShadow: '0 4px 20px rgba(47,125,107,0.08)' }}
        >
          <div>
            <p className="text-[17px] font-semibold text-[#1B2B26]">¿No sabés por dónde empezar?</p>
            <p className="text-[14px] text-[#4B6B5E] mt-0.5">Escribinos y te orientamos sin compromiso.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold px-6 py-3 rounded-full text-[14px] hover:bg-[#245f52] transition-colors shadow-lg shadow-[#2F7D6B]/20"
          >
            Consultar ahora
          </a>
        </motion.div>
      </div>

      <EditDrawer
        isOpen={!!editItem && !addingNew}
        title={`Editar: ${editItem?.title ?? ''}`}
        fields={getFields(editItem ?? undefined)}
        onSave={handleSave}
        onClose={() => setEditItem(null)}
        onDelete={handleDelete}
        deleteLabel="Eliminar servicio"
      />
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
