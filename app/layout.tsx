import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://eclatcentro.com'),
  title: 'Centro ÉCLAT — Un espacio para construir posibilidades',
  description:
    'ÉCLAT acompaña a personas, familias, profesionales e instituciones a través de la clínica, la educación, la formación y el trabajo interdisciplinario.',
  keywords: [
    'psicología',
    'psicopedagogía',
    'fonoaudiología',
    'psicomotricidad',
    'arteterapia',
    'centro eclat',
    'salud mental',
  ],
  icons: {
    icon: '/LOGO.png',
    apple: '/LOGO.png',
  },
  openGraph: {
    title: 'Centro ÉCLAT',
    description: 'Un espacio para construir posibilidades. Clínica, educación, formación e instituciones.',
    url: 'https://eclatcentro.com',
    siteName: 'Centro ÉCLAT',
    images: [{ url: '/LOGO CON NOMBRE.png' }],
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
