"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, FadeIn } from "@/components/AnimatedSection";
import { StaggerList, StaggerItem } from "@/components/StaggerList";
import { HoverCard } from "@/components/HoverCard";

interface Service {
  name: string;
  desc: string;
  imagen_url?: string | null;
}

const SERVICES: Service[] = [
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

interface Props {
  heroTitle: string;
  heroLede: string;
}

export default function HomeClient({ heroTitle, heroLede }: Props) {
  const [dbServices, setDbServices] = useState<{ nombre: string; imagen_url: string }[]>([]);

  useEffect(() => {
    fetch('/api/servicios-publico')
      .then(r => r.json())
      .then(data => setDbServices(data))
      .catch(() => {});
  }, []);

  const svcList = SERVICES.map(s => {
    const fromDB = dbServices.find(db =>
      db.nombre.toLowerCase().trim() === s.name.toLowerCase().trim()
    );
    return { ...s, imagen_url: fromDB?.imagen_url || null };
  });

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function go(n: number, dir = 1) {
    setDirection(dir);
    setActive((n + svcList.length) % svcList.length);
  }
  function start() {
    stop();
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive(i => (i + 1) % svcList.length);
    }, 3600);
  }
  function stop() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  useEffect(() => { start(); return stop; }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero3">
        <div className="wrap">
          <div className="hero3__text">
            <FadeIn direction="up" delay={0}>
              <span className="kicker">Centro de atención integral · Oncativo, Córdoba</span>
              <h1>{heroTitle}</h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <p className="hero3__lede">{heroLede}</p>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <div className="hero3__cta">
                <a className="btn btn--primary" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20solicitar%20una%20entrevista." target="_blank" rel="noopener">Solicitar entrevista</a>
                <Link className="btn btn--ghost" href="/nosotros" style={{ background: "rgba(255,255,255,.6)" }}>Conocer ÉCLAT</Link>
              </div>
            </FadeIn>
          </div>

          <AnimatedSection delay={0.25}>
            <aside className="svcbox" onMouseEnter={stop} onMouseLeave={start}>
              <div className="svcbox__head"><b>Servicios</b><small>Áreas de atención</small></div>
              <div className="rotator">
                <motion.div
                  className="rstage"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragStart={() => { setIsDragging(true); stop(); }}
                  onDragEnd={(_, info) => {
                    setIsDragging(false);
                    if (info.offset.x < -50) go(active + 1, 1);
                    else if (info.offset.x > 50) go(active - 1, -1);
                    start();
                  }}
                  style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.article
                      key={active}
                      className="rslide is-active"
                      initial={{ opacity: 0, x: direction * 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -60 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <div className="rphoto">
                        {svcList[active].imagen_url ? (
                          <img src={svcList[active].imagen_url!} alt={svcList[active].name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '13px', color: 'var(--sage-deep)', fontWeight: 600 }}>
                            Foto · {svcList[active].name}
                          </div>
                        )}
                      </div>
                      <h3 className="rslide__name">{svcList[active].name}</h3>
                      <p className="rslide__desc">{svcList[active].desc}</p>
                    </motion.article>
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="rfoot">
                <div className="rdots">
                  {svcList.map((_, idx) => (
                    <button
                      key={idx}
                      className={`rdot${idx === active ? " is-on" : ""}`}
                      type="button"
                      aria-label={`Servicio ${idx + 1}`}
                      onClick={() => { go(idx, idx >= active ? 1 : -1); start(); }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => window.open(
                    `https://wa.me/5493572441454?text=${encodeURIComponent(`Hola ÉCLAT, quisiera agendar un turno para ${svcList[active].name}.`)}`,
                    '_blank'
                  )}
                  style={{ fontSize: 13, fontWeight: 600, background: 'var(--slate-900)', color: '#fff', padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Agendar turno →
                </button>
              </div>
            </aside>
          </AnimatedSection>
        </div>
      </section>

      {/* PILARES */}
      <section style={{ background: 'var(--sage-50)', borderBlock: '1px solid var(--line)', padding: 'clamp(40px,6vw,72px) 0' }}>
        <div className="wrap">
          <StaggerList className="pilares-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                title: "Salud",
                desc: "Atención clínica e interdisciplinaria"
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
                title: "Educación",
                desc: "Trayectorias educativas e inclusión escolar"
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
                title: "Formación",
                desc: "Cursos, seminarios y actualización profesional"
              }
            ].map((p, i) => (
              <StaggerItem key={i}>
                <div style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: '18px',
                  padding: 'clamp(24px,3vw,36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px -20px rgba(41,51,47,.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'var(--sage-50)', border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--sage-deep)'
                  }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>{p.title}</div>
                    <div style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* SOBRE ÉCLAT */}
      <section className="about">
        <div className="wrap">
          <AnimatedSection>
            <span className="kicker">Quiénes somos</span>
            <h2>Una institución que articula <em>salud mental, educación y formación</em></h2>
            <span className="grule"></span>
            <p>En ÉCLAT construimos cada respuesta junto a las personas, las familias, los profesionales y las instituciones, respetando la particularidad de cada situación. Cada trayectoria merece ser escuchada, pensada y acompañada según sus propias coordenadas.</p>
            <div className="princip">
              <span>Singularidad</span><span>Escucha</span><span>Interdisciplina</span>
              <span>Articulación</span><span>Responsabilidad compartida</span>
            </div>
          </AnimatedSection>
          <StaggerList className="about__stats">
            <StaggerItem><HoverCard className="stat"><div className="n">+30</div><div className="l">Profesionales en un equipo interdisciplinario</div></HoverCard></StaggerItem>
            <StaggerItem><HoverCard className="stat"><div className="n">2022</div><div className="l">Fundada el 9 de julio en Oncativo, Córdoba</div></HoverCard></StaggerItem>
            <StaggerItem><HoverCard className="stat"><div className="n">+364</div><div className="l">Usuarios y familias acompañadas</div></HoverCard></StaggerItem>
          </StaggerList>
        </div>
      </section>

      {/* PUBLICACIONES teaser */}
      <section className="pubs">
        <div className="wrap">
          <AnimatedSection className="pubs__head">
            <div>
              <span className="kicker">Publicaciones</span>
              <h2>Pensar la práctica <span className="tagline">· artículos y materiales</span></h2>
            </div>
            <Link className="lib__more" href="/publicaciones">Ver todas las publicaciones →</Link>
          </AnimatedSection>
          <StaggerList className="writings">
            {WRITINGS.map((w, i) => (
              <StaggerItem key={i}>
                <Link className="writing" href="/publicaciones">
                  <span className="writing__tag">{w.tag}</span>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <span className="writing__meta"><b>Leer →</b></span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerList>
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
