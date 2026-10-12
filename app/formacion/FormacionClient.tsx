'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { WaIcon } from '@/components/WaIcon'

const EJES = [
  "Inclusión escolar","Salud mental infantil","Trabajo interdisciplinario",
  "Psicoanálisis y educación","Orientación a familias",
  "Instituciones educativas","Trayectorias educativas","Discapacidad e inclusión social",
]

interface Curso { id: string; title: string; description: string | null; badge: string | null }
interface Props { heroTitle: string; heroLede: string; cursos: Curso[]; waUrl: string }

export default function FormacionClient({ heroTitle, heroLede, cursos, waUrl }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div ref={heroRef} className="fhero" aria-label="Encabezado de Formación">
        <div className={`fhero__inner ${mounted ? 'fhero__inner--visible' : ''}`}>
          <nav className="fhero__crumb">
            <a href="/">Inicio</a><span aria-hidden="true"> / </span><span>Formación</span>
          </nav>
          <h1 className="fhero__title">{heroTitle}</h1>
          <p className="fhero__lede">{heroLede}</p>
          <div className="fhero__cta">
            <a href="#formaciones" className="fhero__btn-primary">Ver formaciones</a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fhero__btn-ghost">
              <WaIcon />Consultar
            </a>
          </div>
        </div>
        <div className="fhero__word" aria-hidden="true">Formación</div>
        <div className={`fhero__scroll ${scrolled ? 'fhero__scroll--gone' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      <section className="fejes">
        <div className="fejes__inner">
          <p className="fejes__label">Ejes temáticos</p>
          <div className="fejes__flow">
            {EJES.map((e, i) => <span key={i} className="fejes__eje">{e}</span>)}
          </div>
        </div>
      </section>

      <section id="formaciones" className="fcursos">
        <div className="fcursos__inner">
          <header className="fcursos__header">
            <h2 className="fcursos__title">Próximas formaciones</h2>
            <p className="fcursos__sub">Inscripciones abiertas · Modalidad presencial y virtual</p>
          </header>
          {cursos.length > 0 ? (
            <div className="fcursos__grid">
              {cursos.map((c, i) => (
                <Link key={c.id} href={`/cursos/${c.id}`} className="fcard">
                  <div className="fcard__num" aria-hidden="true">{String(i+1).padStart(2,'0')}</div>
                  <div className="fcard__body">
                    <span className="fcard__badge">{c.badge || 'Formación'}</span>
                    <h3 className="fcard__title">{c.title}</h3>
                    {c.description && <p className="fcard__desc">{c.description}</p>}
                  </div>
                  <div className="fcard__arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="fcursos__empty">
              <p>Próximamente nuevas formaciones.</p>
              <p className="fcursos__empty-sub">Escribinos para recibir el calendario y ser de los primeros en anotarte.</p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fcursos__wa">
                <WaIcon />Quiero el calendario
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="fband">
        <div className="fband__inner">
          <div className="fband__text">
            <h2 className="fband__title">Recibí el calendario</h2>
            <p className="fband__sub">Te avisamos cuando se abren las inscripciones de cada curso, seminario o jornada.</p>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fband__cta">
            <WaIcon />Quiero anotarme
          </a>
        </div>
      </section>
    </>
  )
}
