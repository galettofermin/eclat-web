// app/publicaciones/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicaciones · ÉCLAT — Pensar la práctica",
  description: "Publicaciones de ÉCLAT: artículos, recursos y materiales sobre salud mental, educación, inclusión escolar y trabajo interdisciplinario.",
};

const CHIPS = ["Todas", "Inclusión escolar", "Salud mental infantil", "Interdisciplina", "Psicoanálisis y educación", "Familias"];

const WRITINGS = [
  { tag: "Inclusión escolar",          title: "Pensar la inclusión más allá del diagnóstico",     desc: "Sobre los apoyos, los tiempos y las articulaciones que sostienen una trayectoria educativa.", tipo: "Artículo" },
  { tag: "Salud mental infantil",      title: "El malestar en la infancia y sus tiempos",          desc: "Una lectura de los síntomas que no se apura por clasificar.", tipo: "Artículo" },
  { tag: "Interdisciplina",            title: "Construir lecturas compartidas entre disciplinas",  desc: "Cuando distintos actores piensan juntos una misma situación.", tipo: "Ensayo" },
  { tag: "Psicoanálisis y educación",  title: "El deseo de aprender",                              desc: "Notas sobre la relación entre saber, deseo y dificultad.", tipo: "Artículo" },
  { tag: "Familias",                   title: "Acompañar sin invadir: el lugar de los adultos",    desc: "Sobre el sostén en la crianza y los bordes del cuidado.", tipo: "Artículo" },
  { tag: "Instituciones",              title: "La escuela como lugar de encuentro",                desc: "Pensar lo institucional frente a las transformaciones de la época.", tipo: "Ensayo" },
  { tag: "Discapacidad",               title: "Inclusión social más allá de la integración",       desc: "Apuntes sobre derechos, accesibilidad y participación.", tipo: "Artículo" },
  { tag: "Trayectorias",               title: "Cada recorrido educativo es singular",              desc: "Por qué las respuestas estandarizadas no alcanzan.", tipo: "Artículo" },
  { tag: "Aprendizaje",                title: "Entre el deseo de aprender y la dificultad",        desc: "Una lectura psicopedagógica del síntoma escolar.", tipo: "Artículo" },
];

export default function PublicacionesPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb"><a href="/">Inicio</a> &nbsp;/&nbsp; <b>Publicaciones</b></nav>
          <h1>Pensar la <em>práctica.</em></h1>
          <p className="phead__lede">La producción de conocimiento es una dimensión central de la identidad de ÉCLAT. A través de artículos, recursos y materiales de consulta abrimos espacios de reflexión sobre los desafíos contemporáneos de la salud mental y la educación.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="filters reveal">
            {CHIPS.map((c, i) => (
              <span key={i} className={`chip${i === 0 ? " is-on" : ""}`}>{c}</span>
            ))}
          </div>
          <div className="writings reveal">
            {WRITINGS.map((w, i) => (
              <article key={i} className="writing">
                <span className="writing__tag">{w.tag}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <span className="writing__meta">
                  <span>{w.tipo}</span>
                  <b>Leer →</b>
                </span>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "28px", color: "var(--ink-muted)", fontSize: "14.5px" }}>
            Los títulos son ejemplos de la sección. Cuando tengas tus artículos listos, los publicamos acá con su texto completo.
          </p>
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿Querés escribir con nosotros?</h2>
            <p>Recibimos producciones del equipo y de colegas que quieran compartir su práctica.</p>
          </div>
          <a className="btn btn--primary" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20proponer%20una%20publicaci%C3%B3n." target="_blank" rel="noopener">
            Proponer una publicación
          </a>
        </div>
      </section>
    </>
  );
}
