// app/formacion/page.tsx
import type { Metadata } from "next";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedCards, AnimatedCard } from "@/components/AnimatedCards";

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

const AGENDA = [
  { tag: "Inclusión escolar", title: "Del diagnóstico a los apoyos", desc: "Herramientas para acompañar trayectorias educativas: PPI, DAI y articulación con la escuela.", meta: "Presencial · Oncativo" },
  { tag: "Salud mental infantil", title: "El malestar en la infancia", desc: "Un recorrido por los modos de leer y alojar el síntoma en la niñez.", meta: "Virtual" },
  { tag: "Psicoanálisis y educación", title: "Enseñar, aprender, desear", desc: "Trayecto anual sobre las intersecciones entre el psicoanálisis y lo educativo.", meta: "Virtual · Trayecto" },
  { tag: "Trabajo interdisciplinario", title: "Construir lecturas compartidas", desc: "Cómo articular disciplinas frente a situaciones complejas.", meta: "Presencial / Virtual" },
  { tag: "Instituciones educativas", title: "Pensar la escuela hoy", desc: "Jornada de trabajo con equipos directivos y docentes.", meta: "Jornada" },
  { tag: "Orientación a familias", title: "Acompañar la crianza", desc: "Encuentros para pensar los desafíos cotidianos junto a las familias.", meta: "Virtual" },
];

export default function FormacionPage() {
  return (
    <>
      <section className="phead">
        <AnimatedSection className="wrap">
          <nav className="crumb"><a href="/">Inicio</a> &nbsp;/&nbsp; <b>Formación</b></nav>
          <h1>Cursos, seminarios y <em>trayectos formativos.</em></h1>
          <p className="phead__lede">La formación es uno de los pilares estratégicos de ÉCLAT. A través de cursos, seminarios, jornadas y trayectos buscamos compartir herramientas, experiencias y conocimientos vinculados a la salud mental, la educación y el trabajo interdisciplinario.</p>
        </AnimatedSection>
      </section>

      <section className="section">
        <div className="wrap">
          <AnimatedSection>
            <span className="kicker">Ejes temáticos</span>
            <AnimatedCards className="filters" style={{ marginTop: "18px" }}>
              {EJES.map((e, i) => (
                <AnimatedCard key={i}>
                  <span className="chip">{e}</span>
                </AnimatedCard>
              ))}
            </AnimatedCards>
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
          <AnimatedCards className="writings">
            {AGENDA.map((a, i) => (
              <AnimatedCard key={i} className="writing">
                <span className="writing__tag">{a.tag}</span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="writing__meta">
                  <span>{a.meta}</span>
                  <b>Más info →</b>
                </span>
              </AnimatedCard>
            ))}
          </AnimatedCards>
          <p style={{ marginTop: "28px", color: "var(--ink-muted)", fontSize: "14.5px" }}>
            Agenda en construcción — los títulos y modalidades son ejemplos. Escribinos para recibir el calendario actualizado de inscripciones.
          </p>
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>Recibí el calendario de formaciones</h2>
            <p>Te avisamos cuando se abren las inscripciones de cada curso, seminario o jornada.</p>
          </div>
          <a className="btn btn--primary" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quiero%20recibir%20el%20calendario%20de%20formaciones." target="_blank" rel="noopener">
            Quiero el calendario
          </a>
        </div>
      </section>
    </>
  );
}
