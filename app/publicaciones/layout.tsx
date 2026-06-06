import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Publicaciones',
  description: 'Artículos, recursos y materiales sobre salud mental, educación e interdisciplina producidos por el equipo de ÉCLAT.',
  alternates: { canonical: 'https://eclatcentro.com/publicaciones' },
  openGraph: {
    title: 'Publicaciones · ÉCLAT',
    description: 'Artículos y recursos sobre salud mental, educación e interdisciplina del equipo de ÉCLAT.',
    url: 'https://eclatcentro.com/publicaciones',
  },
}

export default function PublicacionesLayout({ children }: { children: React.ReactNode }) {
  return children
}
