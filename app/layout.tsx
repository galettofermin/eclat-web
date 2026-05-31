import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://eclatcentro.com'),
  title: 'Centro ÉCLAT — Cuerpo, voz y palabra',
  description:
    'Centro ÉCLAT: un espacio interdisciplinario de salud y educación. Psicología, Psicopedagogía, Fonoaudiología, Psicomotricidad, Arteterapia y más.',
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
    description: 'Cuerpo, voz y palabra. Un lugar para cada uno.',
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
