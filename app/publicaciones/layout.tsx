import type { Metadata } from 'next'

// page.tsx es un componente cliente y no puede exportar metadata; va acá.
// /publicaciones/[id] la reemplaza con su propio generateMetadata.
const OG_IMAGE = { url: 'https://eclatcentro.com/og-image.png', width: 1200, height: 630, alt: 'ÉCLAT · Publicaciones' }

export const metadata: Metadata = {
  // template: para que los artículos sigan siendo "Título · ÉCLAT"
  title: { absolute: 'Publicaciones · ÉCLAT — Pensar la práctica', template: '%s · ÉCLAT' },
  description: 'Artículos, recursos y reflexiones sobre salud mental, educación e interdisciplina del equipo de ÉCLAT en Oncativo, Córdoba.',
  openGraph: {
    title: 'Publicaciones · ÉCLAT',
    description: 'Artículos sobre salud mental, educación e interdisciplina.',
    url: 'https://eclatcentro.com/publicaciones',
    siteName: 'ÉCLAT Centro de Atención Integral',
    images: [OG_IMAGE],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Publicaciones · ÉCLAT',
    description: 'Artículos sobre salud mental, educación e interdisciplina.',
    images: [OG_IMAGE.url],
  },
  alternates: { canonical: 'https://eclatcentro.com/publicaciones' },
}

export default function PublicacionesLayout({ children }: { children: React.ReactNode }) {
  return children
}
