import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const OG_IMAGE = 'https://eclatcentro.com/og-image.png'

// Metadata de un curso publicado. /cursos/[id] y /formaciones/[slug] muestran el
// mismo curso, así que ambas usan /cursos/[id] como URL canónica.
export async function courseMetadata(id: string): Promise<Metadata> {
  try {
    const { data } = await createAdminClient()
      .from('courses').select('title, description').eq('id', id).eq('published', true).single()
    if (!data) return { title: 'Curso' }

    const description = data.description || 'Formación de ÉCLAT Centro de Atención Integral, Oncativo, Córdoba.'
    const url = `https://eclatcentro.com/cursos/${id}`
    return {
      title: data.title,
      description,
      openGraph: {
        title: `${data.title} · ÉCLAT`,
        description,
        url,
        siteName: 'ÉCLAT Centro de Atención Integral',
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: data.title }],
        type: 'website',
        locale: 'es_AR',
      },
      twitter: { card: 'summary_large_image', title: `${data.title} · ÉCLAT`, description, images: [OG_IMAGE] },
      alternates: { canonical: url },
    }
  } catch {
    return { title: 'Curso' }
  }
}
