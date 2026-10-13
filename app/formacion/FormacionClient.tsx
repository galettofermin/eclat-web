'use client'

import Link from 'next/link'
import { WaIcon } from '@/components/WaIcon'

const EJES = [
  "Inclusión escolar",
  "Salud mental infantil",
  "Trabajo interdisciplinario",
  "Psicoanálisis y educación",
  "Orientación a familias",
  "Instituciones educativas",
  "Trayectorias educativas",
  "Discapacidad e inclusión social",
]

interface Curso {
  id: string
  title: string
  description: string | null
  badge: string | null
}

interface Props {
  heroTitle: string
  heroLede: string
  cursos: Curso[]
  waUrl: string
}

// Va dentro del <main> del layout raíz, por eso es un <div>
export default function FormacionClient({ heroTitle, heroLede, cursos, waUrl }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-gray-400 mb-8">
        <a href="/" className="hover:underline">Inicio</a>
        <span className="mx-2">/</span>
        <span>Formación</span>
      </nav>

      <h1 className="text-3xl font-bold mb-4">{heroTitle}</h1>
      <p className="text-gray-600 mb-10 max-w-xl leading-relaxed">{heroLede}</p>

      <div className="flex flex-wrap gap-2 mb-12">
        {EJES.map((e, i) => (
          <span key={i} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500">{e}</span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6">Próximas formaciones</h2>

      {cursos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {cursos.map((c) => (
            <Link key={c.id} href={`/cursos/${c.id}`}
              className="flex items-center justify-between p-5 border border-[#2F7D6B]/30 rounded-xl hover:border-[#2F7D6B] hover:bg-[#DCEFE8]/40 transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]">
              <div>
                {c.badge && <span className="text-xs font-semibold text-[#2F7D6B] uppercase tracking-wide block mb-1">{c.badge}</span>}
                <p className="font-semibold text-gray-900">{c.title}</p>
                {c.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>}
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-[#2F7D6B] transition-colors flex-shrink-0 ml-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">Próximamente nuevas formaciones.</p>
          <p className="text-sm mb-6">Escribinos para recibir el calendario.</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F7D6B] text-white rounded-full font-semibold text-sm hover:bg-[#245f52] transition-colors">
            <WaIcon /> Quiero el calendario
          </a>
        </div>
      )}

      <div className="mt-16 p-8 bg-gray-50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900 mb-1">Recibí el calendario</h2>
          <p className="text-sm text-gray-500">Te avisamos cuando se abren las inscripciones.</p>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F7D6B] text-white rounded-full font-semibold text-sm hover:bg-[#245f52] transition-colors whitespace-nowrap">
          <WaIcon /> Quiero anotarme
        </a>
      </div>
    </div>
  )
}
