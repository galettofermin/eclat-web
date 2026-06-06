import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conocer ÉCLAT',
  description: 'Historia, filosofía, misión y equipo de dirección de ÉCLAT, centro de atención integral en Oncativo, Córdoba.',
  alternates: { canonical: 'https://eclatcentro.com/conocer' },
  openGraph: {
    title: 'Conocer ÉCLAT · Centro de Atención Integral',
    description: 'Historia, filosofía, misión y equipo de ÉCLAT en Oncativo, Córdoba.',
    url: 'https://eclatcentro.com/conocer',
  },
}

export default function ConocerLayout({ children }: { children: React.ReactNode }) {
  return children
}
