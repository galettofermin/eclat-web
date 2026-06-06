// app/conocer/page.tsx
// Página institucional "Conocer ÉCLAT" — fiel al diseño de Claude Design
// Ruta: /conocer
// Requiere: Google Fonts (Hanken Grotesk) ya configurado en layout.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conocer ÉCLAT · Institución — Oncativo, Córdoba",
  description:
    "Conocé ÉCLAT: institución de salud mental, educación y formación en Oncativo, Córdoba. Historia, filosofía, misión, visión, principios y equipo de dirección.",
};

export default function ConocerPage() {
  return (
    <>
      {/* Encabezado de página */}
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb">
            <Link href="/">Inicio</Link>
            &nbsp;/&nbsp;
            <b>Conocer ÉCLAT</b>
          </nav>
          <h1>
            ÉCLAT, <em>de cerca.</em>
          </h1>
          <p className="phead__lede">
            ÉCLAT articula salud mental, educación y formación para construir
            respuestas frente a los desafíos contemporáneos, reconociendo la
            singularidad de cada trayectoria.
          </p>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <span className="kicker">Nuestra historia</span>
              <h2>
                De una experiencia compartida a una <em>institución</em>
              </h2>
              <span className="grule"></span>
            </div>
            <div className="reveal">
              <p>
                ÉCLAT fue fundado el 9 de julio de 2022 en Oncativo, Córdoba, a
                partir de una experiencia compartida en los campos de la salud
                mental y la educación.
              </p>
              <p>
                A lo largo de años de práctica observamos que muchas situaciones
                que atravesaban niños, adolescentes, familias e instituciones no
                podían comprenderse de manera aislada: lo que aparecía en la
                escuela solía vincularse con aspectos subjetivos, familiares y
                sociales, y muchos padecimientos de la salud mental encontraban
                expresión en lo educativo.
              </p>
              <p>
                ÉCLAT surge del deseo de crear un espacio capaz de articular
                esos campos. Hoy somos un equipo interdisciplinario de más de
                treinta profesionales comprometidos con prácticas éticas y
                situadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA / ÉPOCA */}
      <section className="section section--tint">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <span className="kicker">Nuestra filosofía</span>
              <h2>
                No existen respuestas universales para situaciones{" "}
                <em>singulares</em>
              </h2>
              <span className="grule"></span>
              <p style={{ marginTop: "18px" }}>
                Nuestro trabajo no consiste en aplicar soluciones
                estandarizadas, sino en construir respuestas junto a las
                personas, las familias, los profesionales y las instituciones,
                respetando la particularidad de cada situación.
              </p>
            </div>
            <div className="reveal">
              <span className="kicker">La época actual</span>
              <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>
                Alojar preguntas en tiempos de <em>transformación</em>
              </h2>
              <p style={{ marginTop: "16px" }}>
                Vivimos profundas transformaciones en los modos de aprender,
                vincularse y habitar las instituciones. Las escuelas, las
                familias y los profesionales enfrentan desafíos cada vez más
                complejos, y la salud mental ocupa un lugar creciente en la
                vida cotidiana. Por eso construimos espacios capaces de alojar
                preguntas y generar articulaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN / VISIÓN */}
      <section className="section">
        <div className="wrap">
          <span className="kicker reveal">Misión y visión</span>
          <div className="mv reveal" style={{ marginTop: "22px" }}>
            <div className="mv__card">
              <span className="k">Misión</span>
              <h3>Acompañar trayectorias singulares</h3>
              <p>
                Acompañar a personas, familias, profesionales e instituciones
                mediante prácticas clínicas, educativas y formativas orientadas
                por la singularidad y el trabajo interdisciplinario, construyendo
                respuestas frente a los desafíos de la salud mental y la
                educación.
              </p>
            </div>
            <div className="mv__card">
              <span className="k">Visión</span>
              <h3>Ser una institución de referencia</h3>
              <p>
                Consolidar a ÉCLAT como una institución de referencia en salud
                mental, educación y formación, reconocida por la calidad de sus
                prácticas, su compromiso ético y su capacidad de producir
                conocimiento y construir respuestas en cada época.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPIOS */}
      <section className="section section--tint">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <span className="kicker">Principios institucionales</span>
              <h2>
                Lo que sostiene cada <em>intervención</em>
              </h2>
              <span className="grule"></span>
            </div>
            <div className="reveal">
              <div className="mv__card" style={{ padding: "26px 28px" }}>
                <p style={{ margin: 0, color: "var(--slate-700)" }}>
                  <b style={{ color: "var(--slate-900)" }}>Singularidad.</b>{" "}
                  Cada situación requiere una lectura propia.
                </p>
                <p style={{ marginTop: "12px", color: "var(--slate-700)" }}>
                  <b style={{ color: "var(--slate-900)" }}>Escucha.</b>{" "}
                  Comprender antes de intervenir.
                </p>
                <p style={{ marginTop: "12px", color: "var(--slate-700)" }}>
                  <b style={{ color: "var(--slate-900)" }}>Interdisciplina.</b>{" "}
                  La complejidad actual requiere articular disciplinas.
                </p>
                <p style={{ marginTop: "12px", color: "var(--slate-700)" }}>
                  <b style={{ color: "var(--slate-900)" }}>Articulación.</b>{" "}
                  Promovemos el encuentro entre salud, educación, familias e
                  instituciones.
                </p>
                <p style={{ marginTop: "12px", color: "var(--slate-700)" }}>
                  <b style={{ color: "var(--slate-900)" }}>
                    Responsabilidad compartida.
                  </b>{" "}
                  Las situaciones complejas se construyen en conjunto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECCIÓN */}
      <section className="section">
        <div className="wrap">
          <div className="pubs__head reveal" style={{ marginBottom: "40px" }}>
            <div>
              <span className="kicker">Dirección</span>
              <h2
                style={{
                  fontSize: "clamp(28px,3.6vw,44px)",
                  marginTop: "10px",
                }}
              >
                Quiénes conducen ÉCLAT
              </h2>
            </div>
          </div>
          <div className="dirs reveal">
            <div className="dir">
              <div
                className="dir__photo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--sage-50)",
                  color: "var(--sage-deep)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Foto
              </div>
              <div>
                <div className="dir__name">Lic. Fermín Galetto</div>
                <div className="dir__role">
                  Director General · Licenciado en Psicología
                </div>
                <p className="dir__desc">
                  Responsable de la orientación institucional y del área de
                  salud mental.
                </p>
              </div>
            </div>
            <div className="dir">
              <div
                className="dir__photo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--sage-50)",
                  color: "var(--sage-deep)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Foto
              </div>
              <div>
                <div className="dir__name">Lic. Constanza Giraudo</div>
                <div className="dir__role">
                  Directora del Área Educativa · Licenciada en Psicopedagogía
                </div>
                <p className="dir__desc">
                  Responsable de los procesos educativos, la inclusión escolar
                  y la articulación institucional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ NOS HACE DIFERENTES */}
      <section className="diff">
        <div className="wrap reveal">
          <Image
            className="diff__mark"
            src="/LOGO.png"
            alt=""
            width={116}
            height={116}
            style={{ width: "clamp(80px,9vw,116px)", height: "auto" }}
          />
          <div>
            <h2>
              Construimos puentes donde los problemas suelen quedar
              fragmentados.
            </h2>
            <p>
              La diferencia de ÉCLAT no está sólo en los servicios, sino en
              articular disciplinas —salud mental, educación, familias e
              instituciones— para construir respuestas frente a situaciones
              complejas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿Querés conocernos en persona?</h2>
            <p>
              Estamos en Castelli 260, Oncativo. Pedí una entrevista y
              conversemos.
            </p>
          </div>
          <a
            className="btn btn--primary"
            href={`https://wa.me/5493572441454?text=${encodeURIComponent(
              "Hola ÉCLAT, quisiera solicitar una entrevista."
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
