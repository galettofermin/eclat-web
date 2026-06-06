import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Pedí una entrevista o escribinos. ÉCLAT está en Castelli 260, Oncativo, Córdoba. Atención presencial y virtual, lunes a viernes de 08:00 a 20:00.',
  alternates: { canonical: 'https://eclatcentro.com/contacto' },
  openGraph: {
    title: 'Contacto · ÉCLAT',
    description: 'Castelli 260, Oncativo, Córdoba. WhatsApp +54 9 3572 44-1454. Atención presencial y virtual.',
    url: 'https://eclatcentro.com/contacto',
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
