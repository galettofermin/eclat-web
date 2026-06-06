import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turnos en ÉCLAT Oncativo · Castelli 260, Córdoba',
  description: 'Pedí tu turno en ÉCLAT. Castelli 260, Oncativo, Córdoba. WhatsApp +54 9 3572 44-1454. Lunes a viernes 8 a 20 h.',
  alternates: { canonical: 'https://eclatcentro.com/contacto' },
  openGraph: {
    title: 'Turnos en ÉCLAT Oncativo · Castelli 260, Córdoba',
    description: 'Pedí tu turno en ÉCLAT. Castelli 260, Oncativo. WhatsApp +54 9 3572 44-1454. Lunes a viernes 8 a 20 h.',
    url: 'https://eclatcentro.com/contacto',
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
