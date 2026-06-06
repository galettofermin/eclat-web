'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'
import AdminImageUpload from '@/components/AdminImageUpload'

const AREAS = [
  { name: 'Psicología',                   desc: 'Atención clínica de niños, adolescentes y adultos. Un espacio de escucha para alojar el malestar y construir, caso por caso, una salida posible.' },
  { name: 'Psicopedagogía',               desc: 'Acompañamos los procesos de aprendizaje y la trayectoria escolar, leyendo la dificultad más allá del rendimiento.' },
  { name: 'Fonoaudiología',               desc: 'Lenguaje, voz, habla y comunicación en cada etapa del desarrollo, con abordajes situados.' },
  { name: 'Psicomotricidad',              desc: 'El cuerpo en movimiento como vía de expresión, juego y desarrollo.' },
  { name: 'Inclusión Escolar',            desc: 'Apoyos y articulación con la escuela y la familia para sostener trayectorias educativas: PPI, DAI y acompañamiento.' },
  { name: 'Evaluaciones Interdisciplinarias', desc: 'Lecturas integrales y situadas entre distintas disciplinas, que orientan cada intervención.' },
  { name: 'Orientación a Familias',       desc: 'Un espacio para pensar la crianza, los vínculos y los desafíos cotidianos.' },
  { name: 'Asesoramiento Institucional',  desc: 'Acompañamos a escuelas e instituciones frente a situaciones complejas, construyendo respuestas conjuntas.' },
]

const slugify = (s: string) =>
  s.toLowerCase()
   .normalize('NFD').replace(/[̀-ͯ]/g, '')
   .replace(/\s+/g, '-')
   .replace(/[^a-z0-9-]/g, '')

const WA = 'https://wa.me/5493572441454?text='

export default function ServiciosPage() {
  const { isAdmin } = useAdmin()
  const [images, setImages] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/servicios')
      .then(r => r.json())
      .then((data: { nombre: string; imagen_url: string | null }[]) => {
        if (!Array.isArray(data)) return
        const map: Record<string, string> = {}
        data.forEach(s => { if (s.imagen_url) map[s.nombre] = s.imagen_url })
        setImages(map)
      })
      .catch(() => {})
  }, [])

  const handleUpdate = (nombre: string, url: string) => {
    setImages(prev => ({ ...prev, [nombre]: url }))
    fetch('/api/admin/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, imagen_url: url }),
    })
  }

  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb">
            <Link href="/">Inicio</Link>&nbsp;/&nbsp;<b>Servicios</b>
          </nav>
          <h1>Un lugar para cada <em>situación.</em></h1>
          <p className="phead__lede">
            ÉCLAT desarrolla intervenciones clínicas y educativas articulando distintas disciplinas.
            Cada situación requiere una lectura propia y cada trayectoria, un acompañamiento a su medida.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="areas reveal">
            {AREAS.map((a) => (
              <article key={a.name} className="area">
                <AdminImageUpload
                  className="area__photo"
                  src={images[a.name] ?? null}
                  bucket="servicios"
                  path={`${slugify(a.name)}.jpg`}
                  isAdmin={isAdmin}
                  onUpdate={url => handleUpdate(a.name, url)}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100%', fontSize: 13, color: 'var(--sage-deep)', fontWeight: 600,
                    padding: '0 8px', textAlign: 'center',
                  }}>
                    {a.name}
                  </div>
                </AdminImageUpload>
                <div className="area__body">
                  <h3 className="area__name">{a.name}</h3>
                  <p className="area__desc">{a.desc}</p>
                  <a
                    className="area__go"
                    href={`${WA}${encodeURIComponent(`Hola ÉCLAT, quisiera solicitar una consulta sobre ${a.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Solicitar entrevista →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿No sabés con qué área empezar?</h2>
            <p>Escribinos y te orientamos sobre el profesional indicado para tu consulta.</p>
          </div>
          <a
            className="btn btn--primary"
            href={`${WA}${encodeURIComponent('Hola ÉCLAT, quisiera orientación sobre los servicios.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar entrevista
          </a>
        </div>
      </section>
    </>
  )
}
