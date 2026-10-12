// app/formacion/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StaggerList, StaggerItem } from "@/components/StaggerList";
import { getSiteContent } from "@/lib/siteContent";
import { WA_URL } from "@/lib/constants";
import { WaIcon } from "@/components/WaIcon";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Formación",
  description: "Cursos, seminarios, jornadas y trayectos formativos de ÉCLAT sobre inclusión escolar, salud mental infantil, trabajo interdisciplinario y educación.",
  alternates: { canonical: "https://eclatcentro.com/formacion" },
  openGraph: {
    title: "Formación · ÉCLAT",
    description: "Cursos, seminarios y jornadas sobre inclusión escolar, salud mental y trabajo interdisciplinario.",
    url: "https://eclatcentro.com/formacion",
  },
};

const EJES = [
  "Inclusión escolar", "Salud mental infantil", "Trabajo interdisciplinario",
  "Psicoanálisis y educación", "Orientación a familias",
  "Instituciones educativas", "Trayectorias educativas", "Discapacidad e inclusión social",
];

const DEFAULTS = {
  'formacion.hero.title': 'Cursos, seminarios y trayectos formativos.',
  'formacion.hero.lede': 'Un espacio donde la práctica se piensa y se transmite. A través de cursos, seminarios, jornadas y trayectos buscamos compartir herramientas, experiencias y conocimientos vinculados a la salud mental, la educación y el trabajo interdisciplinario.',
}

export default async function FormacionPage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]
  const heroTitle = get('formacion.hero.title')
  const heroLede = get('formacion.hero.lede')

  const { data: cursos } = await createClient()
    .from('courses')
    .select('id, title, description, badge')
    .eq('published', true)
    .order('sort_order')

  return (
    <>
      <section className="phead">
        <AnimatedSection className="wrap">
          <nav className="crumb"><a href="/">Inicio</a> &nbsp;/&nbsp; <b>Formación</b></nav>
          <h1>{heroTitle}</h1>
          <p className="phead__lede">{heroLede}</p>
        </AnimatedSection>
      </section>

      <section className="section">
        <div className="wrap">
          <AnimatedSection>
            <span className="kicker">Ejes temáticos</span>
            <StaggerList className="filters" style={{ marginTop: "18px" }}>
              {EJES.map((e, i) => (
                <StaggerItem key={i}>
                  <span className="chip">{e}</span>
                </StaggerItem>
              ))}
            </StaggerList>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section--tint">
        <div className="wrap">
          <AnimatedSection className="pubs__head" style={{ marginBottom: "40px" }}>
            <div>
              <span className="kicker">Agenda</span>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", marginTop: "10px" }}>Próximas formaciones</h2>
            </div>
          </AnimatedSection>
          {cursos?.length ? (
            <StaggerList className="writings">
              {cursos.map(c => (
                <StaggerItem key={c.id}>
                  <Link className="writing" href={`/cursos/${c.id}`}>
                    <span className="writing__tag">{c.badge || 'Formación'}</span>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <span className="writing__meta"><b>Más info →</b></span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerList>
          ) : (
            <AnimatedSection style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ fontSize: 18, color: 'var(--slate-900)', marginBottom: 20 }}>
                Próximamente nuevas formaciones. Escribinos para recibir el calendario.
              </p>
              <a className="btn-wa" href={WA_URL("Hola ÉCLAT, quiero recibir el calendario de formaciones.")} target="_blank" rel="noopener noreferrer">
                <WaIcon />Escribir por WhatsApp
              </a>
            </AnimatedSection>
          )}
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>Recibí el calendario de formaciones</h2>
            <p>Te avisamos cuando se abren las inscripciones de cada curso, seminario o jornada.</p>
          </div>
          <a className="btn-wa" href={WA_URL("Hola ÉCLAT, quiero recibir el calendario de formaciones.")} target="_blank" rel="noopener">
            <WaIcon />Quiero el calendario
          </a>
        </div>
      </section>
    </>
  );
}
