// app/servicios/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios · ÉCLAT — Oncativo, Córdoba",
  description: "Áreas de atención de ÉCLAT en Oncativo, Córdoba: psicología, psicopedagogía, fonoaudiología, psicomotricidad, inclusión escolar, evaluaciones interdisciplinarias, orientación a familias y asesoramiento institucional.",
};

const AREAS = [
  { name: "Psicología", desc: "Atención clínica de niños, adolescentes y adultos. Un espacio de escucha para alojar el malestar y construir, caso por caso, una salida posible." },
  { name: "Psicopedagogía", desc: "Acompañamos los procesos de aprendizaje y la trayectoria escolar, leyendo la dificultad más allá del rendimiento." },
  { name: "Fonoaudiología", desc: "Lenguaje, voz, habla y comunicación en cada etapa del desarrollo, con abordajes situados." },
  { name: "Psicomotricidad", desc: "El cuerpo en movimiento como vía de expresión, juego y desarrollo." },
  { name: "Inclusión Escolar", desc: "Apoyos y articulación con la escuela y la familia para sostener trayectorias educativas: PPI, DAI y acompañamiento." },
  { name: "Evaluaciones Interdisciplinarias", desc: "Lecturas integrales y situadas entre distintas disciplinas, que orientan cada intervención." },
  { name: "Orientación a Familias", desc: "Un espacio para pensar la crianza, los vínculos y los desafíos cotidianos." },
  { name: "Asesoramiento Institucional", desc: "Acompañamos a escuelas e instituciones frente a situaciones complejas, construyendo respuestas conjuntas." },
];

export default function ServiciosPage() {
  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb"><a href="/">Inicio</a> &nbsp;/&nbsp; <b>Servicios</b></nav>
          <h1>Ocho áreas, una mirada <em>interdisciplinaria.</em></h1>
          <p className="phead__lede">ÉCLAT desarrolla intervenciones clínicas y educativas articulando distintas disciplinas. Cada situación requiere una lectura propia y cada trayectoria, un acompañamiento a su medida.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="areas reveal">
            {AREAS.map((a, i) => (
              <article key={i} className="area">
                <div className="area__photo" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "var(--sage-deep)", fontWeight: 600 }}>
                  Foto · {a.name}
                </div>
                <div className="area__body">
                  <h3 className="area__name">{a.name}</h3>
                  <p className="area__desc">{a.desc}</p>
                  <span className="area__go">Solicitar entrevista →</span>
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
          <a className="btn btn--primary" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20orientaci%C3%B3n%20sobre%20los%20servicios." target="_blank" rel="noopener">
            Solicitar entrevista
          </a>
        </div>
      </section>
    </>
  );
}
