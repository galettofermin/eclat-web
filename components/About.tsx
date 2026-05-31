'use client'

import FadeUp from './FadeUp'

interface AboutProps {
  siteConfig?: Record<string, string>
}

export default function About({ siteConfig }: AboutProps) {
  const title = siteConfig?.about_title ?? 'Un centro pensado para cada persona.'
  const body = siteConfig?.about_body ?? 'Centro de Atención Integral reconocido y habilitado por el Ministerio de Desarrollo Social, registrado en el Registro Nacional de Prestadores de la Superintendencia de Servicios de Salud.'
  const quote = siteConfig?.about_quote ?? 'Una sociedad inclusiva reconoce y celebra la diversidad, promoviendo la igualdad de oportunidades.'
  const mision = siteConfig?.about_mision ?? 'Potenciar la calidad de vida promoviendo el bienestar emocional, la salud mental y la diversidad.'
  const valores = siteConfig?.about_valores ?? 'Contención, calidez, confianza y respeto. Un lugar donde cada persona se siente valorada.'
  const enfoque = siteConfig?.about_enfoque ?? 'Mirada singular centrada en las necesidades, deseos y capacidades de cada persona.'

  const columns = [
    { title: 'Misión', body: mision },
    { title: 'Valores', body: valores },
    { title: 'Enfoque', body: enfoque },
  ]

  return (
    <section id="sobre" className="py-32 px-6 bg-[#F5F5F7]">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-[#2F7D6B] text-[13px] font-semibold tracking-widest uppercase mb-4">
            Sobre ÉCLAT
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold tracking-tight text-[#0A0A0A] leading-tight mb-8 max-w-2xl">
            {title}
          </h2>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="text-[17px] text-[#424245] leading-relaxed mb-6 max-w-3xl">{body}</p>
        </FadeUp>

        <div className="grid sm:grid-cols-3 gap-6 mt-12 mb-20">
          {columns.map((col, i) => (
            <FadeUp key={col.title} delay={0.1 * (i + 1)}>
              <div className="bg-white rounded-2xl p-8 border border-black/5 h-full">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-[#2F7D6B] mb-4">
                  {col.title}
                </h3>
                <p className="text-[15px] text-[#424245] leading-relaxed">{col.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* REEMPLAZAR CON FOTO REAL del equipo */}
        <FadeUp delay={0.2}>
          <div className="w-full rounded-3xl bg-white border border-black/5 h-64 flex flex-col items-center justify-center gap-4 mb-16 overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#DCEFE8] flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-[13px] text-[#6E6E73] font-medium">Foto del equipo</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <blockquote className="border-l-2 border-[#2F7D6B] pl-8 py-2">
            <p className="text-[clamp(1.1rem,2.5vw,1.4rem)] font-light leading-relaxed text-[#0A0A0A] mb-3">
              "{quote}"
            </p>
            <cite className="text-[13px] text-[#6E6E73] not-italic">— Centro ÉCLAT</cite>
          </blockquote>
        </FadeUp>
      </div>
    </section>
  )
}
