import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios · ÉCLAT — Oncativo, Córdoba",
  description:
    "Áreas de atención de ÉCLAT en Oncativo, Córdoba: psicología, psicopedagogía, fonoaudiología, psicomotricidad, inclusión escolar, evaluaciones interdisciplinarias, orientación a familias y asesoramiento institucional.",
};

const STATIC_AREAS = [
  { name: "Psicología", desc: "Atención clínica de niños, adolescentes y adultos. Un espacio de escucha para alojar el malestar y construir, caso por caso, una salida posible.", img: null },
  { name: "Psicopedagogía", desc: "Acompañamos los procesos de aprendizaje y la trayectoria escolar, leyendo la dificultad más allá del rendimiento.", img: null },
  { name: "Fonoaudiología", desc: "Lenguaje, voz, habla y comunicación en cada etapa del desarrollo, con abordajes situados.", img: null },
  { name: "Psicomotricidad", desc: "El cuerpo en movimiento como vía de expresión, juego y desarrollo.", img: null },
  { name: "Inclusión Escolar", desc: "Apoyos y articulación con la escuela y la familia para sostener trayectorias educativas: PPI, DAI y acompañamiento.", img: null },
  { name: "Evaluaciones Interdisciplinarias", desc: "Lecturas integrales y situadas entre distintas disciplinas, que orientan cada intervención.", img: null },
  { name: "Orientación a Familias", desc: "Un espacio para pensar la crianza, los vínculos y los desafíos cotidianos.", img: null },
  { name: "Asesoramiento Institucional", desc: "Acompañamos a escuelas e instituciones frente a situaciones complejas, construyendo respuestas conjuntas.", img: null },
];

export default async function ServiciosPage() {
  const supabase = createClient();

  const [{ data: services }, { data: servicios }] = await Promise.all([
    supabase.from("services").select("*").eq("published", true).order("sort_order"),
    supabase.from("servicios").select("*").order("orden"),
  ]);

  let areas: { name: string; desc: string; img: string | null }[];

  if (services && services.length > 0) {
    const imageMap: Record<string, string | null> = {};
    (servicios ?? []).forEach((s) => {
      imageMap[s.nombre] = s.imagen_url || null;
    });
    areas = services.map((s) => ({
      name: s.title,
      desc: s.description,
      img: imageMap[s.title] ?? null,
    }));
  } else {
    areas = STATIC_AREAS;
  }

  const waBase = `https://wa.me/5493572441454?text=`;

  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb">
            <Link href="/">Inicio</Link>
            &nbsp;/&nbsp;
            <b>Servicios</b>
          </nav>
          <h1>
            Un lugar para cada <em>situación.</em>
          </h1>
          <p className="phead__lede">
            ÉCLAT desarrolla intervenciones clínicas y educativas articulando
            distintas disciplinas. Cada situación requiere una lectura propia y
            cada trayectoria, un acompañamiento a su medida.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="areas reveal">
            {areas.map((a, i) => (
              <article key={i} className="area">
                <div
                  className="area__photo"
                  style={
                    a.img
                      ? { backgroundImage: `url(${a.img})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "var(--sage-deep)", fontWeight: 600 }
                  }
                >
                  {!a.img && a.name}
                </div>
                <div className="area__body">
                  <h3 className="area__name">{a.name}</h3>
                  <p className="area__desc">{a.desc}</p>
                  <a
                    className="area__go"
                    href={`${waBase}${encodeURIComponent(`Hola ÉCLAT, quisiera solicitar una consulta sobre ${a.name}.`)}`}
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
            <p>
              Escribinos y te orientamos sobre el profesional indicado para tu
              consulta.
            </p>
          </div>
          <a
            className="btn btn--primary"
            href={`${waBase}${encodeURIComponent(
              "Hola ÉCLAT, quisiera orientación sobre los servicios."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar entrevista
          </a>
        </div>
      </section>
    </>
  );
}
