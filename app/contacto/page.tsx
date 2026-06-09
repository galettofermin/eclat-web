// app/contacto/page.tsx
"use client";
import { FormEvent } from "react";
import { FadeIn } from "@/components/AnimatedSection";

const MOTIVOS = [
  "Solicitar una entrevista", "Psicología", "Psicopedagogía", "Fonoaudiología",
  "Psicomotricidad", "Inclusión escolar", "Evaluaciones interdisciplinarias",
  "Orientación a familias", "Asesoramiento institucional", "Formación / cursos", "Otra consulta",
];

export default function ContactoPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre  = (form.querySelector("#nombre")  as HTMLInputElement).value.trim();
    const tel     = (form.querySelector("#tel")      as HTMLInputElement).value.trim();
    const motivo  = (form.querySelector("#motivo")   as HTMLSelectElement).value;
    const mensaje = (form.querySelector("#mensaje")  as HTMLTextAreaElement).value.trim();
    let txt = `Hola ÉCLAT, soy ${nombre || "(sin nombre)"}.\nMotivo: ${motivo}.`;
    if (mensaje) txt += `\n${mensaje}`;
    if (tel)     txt += `\nTel: ${tel}`;
    window.open(`https://wa.me/5493572441454?text=${encodeURIComponent(txt)}`, "_blank");
  }

  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb"><a href="/">Inicio</a> &nbsp;/&nbsp; <b>Contacto</b></nav>
          <h1>Pedí una entrevista o <em>escribinos.</em></h1>
          <p className="phead__lede">Estamos en Oncativo, Córdoba, y atendemos de manera presencial y virtual. Contanos brevemente tu consulta y te orientamos sobre el área y el profesional indicado.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="contact">
            {/* Datos de contacto */}
            <FadeIn direction="right" className="cinfo">
              <div className="cinfo__row">
                <div className="k">WhatsApp</div>
                <div className="v"><a href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20solicitar%20una%20entrevista.">+54 9 3572 44-1454</a></div>
                <small>La vía más rápida para pedir un turno.</small>
              </div>
              <div className="cinfo__row">
                <div className="k">Correo</div>
                <div className="v"><a href="mailto:centrointegraleclat@gmail.com">centrointegraleclat@gmail.com</a></div>
              </div>
              <div className="cinfo__row">
                <div className="k">Dirección</div>
                <div className="v">Castelli 260 — Oncativo, Córdoba</div>
                <small>Argentina</small>
              </div>
              <div className="cinfo__row">
                <div className="k">Horario</div>
                <div className="v">Lunes a viernes, 08:00 – 20:00 h</div>
              </div>
              <div className="cinfo__row">
                <div className="k">Modalidad</div>
                <div className="v">Presencial y virtual</div>
              </div>
              <div className="cinfo__row">
                <div className="k">Instagram</div>
                <div className="v"><a href="https://instagram.com/eclatcentro" target="_blank" rel="noopener">@eclatcentro</a></div>
              </div>
            </FadeIn>

            {/* Formulario */}
            <FadeIn direction="left" delay={0.1}>
              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="nombre">Nombre y apellido</label>
                    <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" required />
                  </div>
                  <div className="field">
                    <label htmlFor="tel">Teléfono</label>
                    <input id="tel" name="tel" type="tel" placeholder="Cód. + número" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="motivo">Motivo de la consulta</label>
                  <select id="motivo" name="motivo">
                    {MOTIVOS.map((m, i) => <option key={i}>{m}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea id="mensaje" name="mensaje" placeholder="Contanos brevemente en qué podemos ayudarte"></textarea>
                </div>
                <button className="btn btn--primary" type="submit">Enviar por WhatsApp</button>
                <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--ink-muted)" }}>
                  Al enviar se abre WhatsApp con tu mensaje listo para confirmar.
                </p>
              </form>

              <div className="map" style={{ padding: 0, minHeight: 0 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.5!2d-63.6833!3d-31.9167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCastelli+260%2C+Oncativo%2C+C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1"
                  width="100%"
                  height="320"
                  style={{ border: 'none', borderRadius: 16, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ÉCLAT — Castelli 260, Oncativo, Córdoba"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
