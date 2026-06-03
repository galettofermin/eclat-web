import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eclatcentro.com'),
  title: 'ÉCLAT | Centro de Atención Integral — Rosario',
  description:
    'Centro de atención integral en Rosario. Psicología, Psicopedagogía, Fonoaudiología, Psicomotricidad, Docente de apoyo, Acompañante terapéutico, Evaluaciones diagnósticas y Arteterapia.',
  keywords: [
    'psicología Rosario',
    'psicopedagogía Rosario',
    'fonoaudiología',
    'centro de atención integral',
    'ÉCLAT',
    'salud mental niños',
    'psicomotricidad',
    'acompañante terapéutico Rosario',
  ],
  alternates: {
    canonical: 'https://eclatcentro.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/LOGO.png',
    apple: '/LOGO.png',
  },
  openGraph: {
    title: 'ÉCLAT | Centro de Atención Integral — Rosario',
    description:
      'Centro de atención integral en Rosario. Psicología, Psicopedagogía, Fonoaudiología, Psicomotricidad, Docente de apoyo, Acompañante terapéutico, Evaluaciones diagnósticas y Arteterapia.',
    url: 'https://eclatcentro.com',
    siteName: 'ÉCLAT Centro de Atención Integral',
    images: [{ url: '/logo-eclat.png', width: 512, height: 512, alt: 'ÉCLAT Centro de Atención Integral' }],
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  )
}
