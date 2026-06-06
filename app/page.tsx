// app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SERVICES = [
  { name: "Psicología", desc: "Atención clínica de niños, adolescentes y adultos desde una escucha singular." },
  { name: "Psicopedagogía", desc: "Acompañamiento de los procesos de aprendizaje y la trayectoria escolar." },
  { name: "Fonoaudiología", desc: "Lenguaje, voz y comunicación en cada etapa del desarrollo." },
  { name: "Psicomotricidad", desc: "El cuerpo en movimiento como vía de expresión y desarrollo." },
  { name: "Inclusión Escolar", desc: "Apoyos y articulación con la escuela para sostener trayectorias educativas." },
  { name: "Evaluaciones Interdisciplinarias", desc: "Lecturas integrales y situadas que orientan cada intervención." },
  { name: "Orientación a Familias", desc: "Un espacio para pensar la crianza y los desafíos cotidianos." },
  { name: "Asesoramiento Institucional", desc: "Acompañamiento a escuelas e instituciones frente a situaciones complejas." },
];

const WRITINGS = [
  { tag: "Inclusión escolar", title: "Pensar la inclusión más allá del diagnóstico", desc: "Sobre los apoyos, los tiempos y las articulaciones que sostienen una trayectoria." },
  { tag: "Salud mental infantil", title: "El malestar en la infancia y sus tiempos", desc: "Una lectura de los síntomas que no se apura por clasificar." },
  { tag: "Interdisciplina", title: "Construir lecturas compartidas entre disciplinas", desc: "Cuando distintos actores piensan juntos una misma situación." },
];

export default function HomePage() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function go(n: number) { setActive((n + SERVICES.length) % SERVICES.length); }
  function start() { stop(); timerRef.current = setInterval(() => setActive(i => (i + 1) % SERVICES.length), 3600); }
  function stop() { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }

  useEffect(() => { start(); return stop; }, []);

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <>
      {/* HERO */}
      <section className="hero3">
        <div className="wrap reveal">
          <div className="hero3__text">
            <span className="kicker">Centro de atención integral · Oncativo, Córdoba</span>
            <h1>Salud mental, educación y acompañamiento <em>interdisciplinario.</em></h1>
            <p className="hero3__lede">Construimos respuestas singulares frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.</p>
            <div className="hero3__cta">
              <a className="btn btn--primary" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20solicitar%20una%20entrevista." target="_blank" rel="noopener">Solicitar entrevista</a>
              <Link className="btn btn--ghost" href="/conocer" style={{ background: "rgba(255,255,255,.6)" }}>Conocer ÉCLAT</Link>
            </div>
          </div>

          {/* Caja rotadora de servicios */}
          <aside className="svcbox" onMouseEnter={stop} onMouseLeave={start}>
            <div className="svcbox__head"><b>Servicios</b><small>Áreas de atención</small></div>
            <div className="rotator">
              <div className="rstage">
                {SERVICES.map((s, idx) => (
                  <article key={idx} className={`rslide${idx === active ? " is-active" : ""}`}>
                    <div className="rphoto" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "var(--sage-deep)", fontWeight: 600 }}>
                      Foto · {s.name}
                    </div>
                    <h3 className="rslide__name">{s.name}</h3>
                    <p className="rslide__desc">{s.desc}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rfoot">
              <span className="rcounter">{pad(active)} / {pad(SERVICES.length - 1)}</span>
              <div className="rdots">
                {SERVICES.map((_, idx) => (
                  <button key={idx} className={`rdot${idx === active ? " is-on" : ""}`} type="button" aria-label={`Servicio ${idx + 1}`} onClick={() => { go(idx); start(); }} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* PILARES */}
      <section className="strip">
        <div className="wrap">
          <span><b>Salud</b> — atención clínica e interdisciplinaria</span>
          <span><b>Educación</b> — trayectorias educativas e inclusión escolar</span>
          <span><b>Formación</b> — cursos, seminarios y actualización profesional</span>
        </div>
      </section>

      {/* SOBRE ÉCLAT */}
      <section className="about">
        <div className="wrap">
          <div className="reveal">
            <span className="kicker">Quiénes somos</span>
            <h2>Una institución que articula <em>salud mental, educación y formación</em></h2>
            <span className="grule"></span>
            <p>En ÉCLAT construimos cada respuesta junto a las personas, las familias, los profesionales y las instituciones, respetando la particularidad de cada situación. Cada trayectoria merece ser escuchada, pensada y acompañada según sus propias coordenadas.</p>
            <div className="princip">
              <span>Singularidad</span>
              <span>Escucha</span>
              <span>Interdisciplina</span>
              <span>Articulación</span>
              <span>Responsabilidad compartida</span>
            </div>
          </div>
          <div className="about__stats reveal">
            <div className="stat"><div className="n">+30</div><div className="l">Profesionales en un equipo interdisciplinario</div></div>
            <div className="stat"><div className="n">2022</div><div className="l">Fundada el 9 de julio en Oncativo, Córdoba</div></div>
            <div className="stat"><div className="n">+364</div><div className="l">Usuarios y familias acompañadas</div></div>
          </div>
        </div>
      </section>

      {/* PUBLICACIONES teaser */}
      <section className="pubs">
        <div className="wrap">
          <div className="pubs__head reveal">
            <div>
              <span className="kicker">Publicaciones</span>
              <h2>Pensar la práctica <span className="tagline">· artículos y materiales</span></h2>
            </div>
            <Link className="lib__more" href="/publicaciones">Ver todas las publicaciones →</Link>
          </div>
          <div className="writings reveal">
            {WRITINGS.map((w, i) => (
              <Link key={i} className="writing" href="/publicaciones">
                <span className="writing__tag">{w.tag}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <span className="writing__meta"><b>Leer →</b></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FRASE */}
      <section className="quote3">
        <div className="wrap reveal">
          <blockquote>"No existen respuestas universales para situaciones singulares."</blockquote>
          <cite>Nuestra filosofía</cite>
        </div>
      </section>

      {/* Contenido SEO indexable */}
      <section style={{ padding: '48px 0' }}>
        <div className="wrap">
          <h2 style={{ fontSize: '24px', color: 'var(--slate-900)' }}>Psicólogos y especialistas en Oncativo, Córdoba</h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: '12px', maxWidth: '72ch' }}>
            ÉCLAT es un centro de atención integral ubicado en Castelli 260, Oncativo, Córdoba.
            Contamos con psicólogos, psicopedagogas, fonoaudiólogos, especialistas en psicomotricidad
            y docentes de apoyo para la inclusión escolar. Atendemos niños, adolescentes, adultos y familias
            de manera presencial en Oncativo y de forma virtual para toda la provincia de Córdoba y el país.
          </p>
        </div>
      </section>
    </>
  );
}
