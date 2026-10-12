import type { Metadata } from "next";
import { getSiteContent } from "@/lib/siteContent";
import { WA_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import FormacionClient from "./FormacionClient";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Formación",
  description: "Cursos, seminarios, jornadas y trayectos formativos de ÉCLAT sobre inclusión escolar, salud mental infantil, trabajo interdisciplinario y educación.",
  alternates: { canonical: "https://eclatcentro.com/formacion" },
  openGraph: {
    title: "Formación · ÉCLAT",
    description: "Cursos, seminarios y jornadas sobre inclusión escolar, salud mental y trabajo interdisciplinario.",
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
    .from('courses').select('id, title, description, badge')
    .eq('published', true).order('sort_order')
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
