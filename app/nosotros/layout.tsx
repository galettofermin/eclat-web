import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Historia, filosofía, misión y equipo de dirección de ÉCLAT, centro de atención integral en Oncativo, Córdoba.',
  alternates: { canonical: 'https://eclatcentro.com/nosotros' },
  openGraph: {
    title: 'Nosotros · Centro de Atención Integral',
    description: 'Historia, filosofía, misión y equipo de ÉCLAT en Oncativo, Córdoba.',
    url: 'https://eclatcentro.com/nosotros',
  },
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children
}
