import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Psicólogo, Psicopedagogo y Fonoaudiólogo en Oncativo · ÉCLAT',
  description: 'Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar en Oncativo, Córdoba. Atención presencial y virtual.',
  alternates: { canonical: 'https://eclatcentro.com/servicios' },
  openGraph: {
    title: 'Psicólogo, Psicopedagogo y Fonoaudiólogo en Oncativo · ÉCLAT',
    description: 'Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar en Oncativo, Córdoba. Atención presencial y virtual.',
    url: 'https://eclatcentro.com/servicios',
  },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return children
}
