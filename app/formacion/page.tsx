// app/formacion/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/siteContent";
import { WA_URL } from "@/lib/constants";
import { WaIcon } from "@/components/WaIcon";
import { createClient } from "@/lib/supabase/server";
import FormacionClient from "./FormacionClient";

export const revalidate = 60

export const metadata: Metadata = {
  title: "Formación",
  description: "Cursos y seminarios virtuales sobre inclusión escolar, salud mental infantil, autismo, TDAH y trabajo interdisciplinario. Formación para profesionales de la salud y la educación.",
  keywords: [
    'cursos salud mental', 'formación inclusión escolar', 'seminario autismo',
    'capacitación TDAH', 'psicoanálisis y educación', 'formación profesional Córdoba',
    'cursos virtuales salud mental', 'trabajo interdisciplinario', 'infancia y adolescencia formación',
  ],
  alternates: { canonical: "https://eclatcentro.com/formacion" },
  openGraph: {
    title: "Formación · ÉCLAT",
    description: "Cursos y seminarios virtuales sobre inclusión escolar, salud mental infantil, autismo, TDAH y trabajo interdisciplinario.",
    url: "https://eclatcentro.com/formacion",
  },
};

const DEFAULTS = {
  'formacion.hero.title': 'Cursos, seminarios y trayectos formativos.',
  'formacion.hero.lede': 'Un espacio donde la práctica se piensa y se transmite. Compartimos herramientas, experiencias y conocimientos vinculados a la salud mental, la educación y el trabajo interdisciplinario.',
}

export default async function FormacionPage() {
  const content = await getSiteContent(Object.keys(DEFAULTS))
  const get = (key: keyof typeof DEFAULTS) => content[key] ?? DEFAULTS[key]

  const { data: cursos } = await createClient()
    .from('courses')
    .select('id, title, description, badge')
    .eq('published', true)
    .order('sort_order')

  const waUrl = WA_URL("Hola ÉCLAT, quiero recibir el calendario de formaciones.")

  return (
    <FormacionClient
      heroTitle={get('formacion.hero.title')}
      heroLede={get('formacion.hero.lede')}
      cursos={cursos ?? []}
      waUrl={waUrl}
    />
  )
}
