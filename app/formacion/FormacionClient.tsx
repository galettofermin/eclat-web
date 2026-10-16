'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { WaIcon } from '@/components/WaIcon'

const EJES = [
  "Inclusión escolar",
  "Salud mental infantil",
  "Trabajo interdisciplinario",
  "Psicoanálisis y educación",
  "Orientación a familias",
  "Instituciones educativas",
  "Trayectorias educativas",
  "Discapacidad e inclusión social",
]

interface Curso {
  id: string
  title: string
  description: string | null
  badge: string | null
}

interface Props {
  heroTitle: string
  heroLede: string
  cursos: Curso[]
  waUrl: string
}


export default function FormacionClient({ heroTitle, heroLede, cursos, waUrl }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ticker: ejes animados en bucle
  const tickerRef = useRef<HTMLDivElement>(null)

  // Cards staggered
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])

  const setCardRef = useCallback((el: HTMLAnchorElement | null, i: number) => {
    cardRefs.current[i] = el
  }, [])

  useEffect(() => {
    setMounted(true)
    setVisibleCards(new Array(cursos.length).fill(false))

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [cursos.length])

  // Observar cada card individualmente para stagger
  useEffect(() => {
    if (!mounted) return
    const observers: IntersectionObserver[] = []
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisibleCards(prev => {
              const next = [...prev]
              next[i] = true
              return next
            })
          }, i * 90)
          obs.disconnect()
        }
      }, { threshold: 0.1 })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [mounted, cursos.length])

  return (
    <>
      {/* ── Hero ── */}
      <div ref={heroRef} className="fhero" aria-label="Encabezado de Formación">
        <div className={`fhero__inner ${mounted ? 'fhero__inner--visible' : ''}`}>
          <nav className="fhero__crumb">
            <a href="/">Inicio</a>
            <span aria-hidden="true"> / </span>
            <span>Formación</span>
          </nav>

          <div className="fhero__eyebrow" aria-hidden="true">
            <span className="fhero__dot" />
            Próximas formaciones
          </div>

          <h1 className="fhero__title">{heroTitle}</h1>
          <p className="fhero__lede">{heroLede}</p>

          <div className="fhero__cta">
            <a href="#formaciones" className="fhero__btn-primary">
              Ver formaciones
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fhero__btn-ghost">
              <WaIcon />
              Consultar
            </a>
          </div>
        </div>

        {/* Decoración tipográfica de fondo */}
        <div className="fhero__word" aria-hidden="true">Formación</div>

        {/* Orbe decorativo animado */}
        <div className="fhero__orb" aria-hidden="true" />

        {/* Scroll indicator */}
        <div className={`fhero__scroll ${scrolled ? 'fhero__scroll--gone' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* ── Ticker de ejes temáticos ── */}
      <section className="fejes" aria-label="Ejes temáticos">
        <div className="fejes__ticker-wrap">
          <div className="fejes__ticker" ref={tickerRef} aria-hidden="true">
            {/* Duplicado para bucle continuo */}
            {[...EJES, ...EJES].map((e, i) => (
              <span key={i} className="fejes__eje">
                <span className="fejes__dot-sm" aria-hidden="true">·</span>
                {e}
              </span>
            ))}
          </div>
        </div>
        {/* Versión accesible oculta visualmente */}
        <ul className="fejes__accessible">
          {EJES.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </section>

      {/* ── Cursos ── */}
      <section id="formaciones" className="fcursos">
        <div className="fcursos__inner">
          <header className="fcursos__header">
            <p className="fcursos__eyebrow">Inscripciones abiertas · Modalidad presencial y virtual</p>
            <h2 className="fcursos__title">Próximas formaciones</h2>
          </header>

          {cursos.length > 0 ? (
            <div className="fcursos__grid">
              {cursos.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/cursos/${c.id}`}
                  className={`fcard ${visibleCards[i] ? 'fcard--visible' : ''}`}
                  ref={el => setCardRef(el, i)}
                >
                  <div className="fcard__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="fcard__body">
                    <span className="fcard__badge">{c.badge || 'Formación'}</span>
                    <h3 className="fcard__title">{c.title}</h3>
                    {c.description && (
                      <p className="fcard__desc">{c.description}</p>
                    )}
                  </div>
                  <div className="fcard__footer">
                    <span className="fcard__cta-text">Ver más</span>
                    <span className="fcard__arrow" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                  {/* Brillo en hover */}
                  <span className="fcard__shine" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="fcursos__empty">
              <p>Próximamente nuevas formaciones.</p>
              <p className="fcursos__empty-sub">Escribinos para recibir el calendario y ser de los primeros en anotarte.</p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fcursos__wa">
                <WaIcon />
                Quiero el calendario
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Franja final ── */}
      <section className="fband">
        <div className="fband__inner">
          <div className="fband__text">
            <h2 className="fband__title">Recibí el calendario</h2>
            <p className="fband__sub">Te avisamos cuando se abren las inscripciones de cada curso, seminario o jornada.</p>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fband__cta">
            <WaIcon />
            Quiero anotarme
          </a>
        </div>
      </section>
    </>
  )
}
