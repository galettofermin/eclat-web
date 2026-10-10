import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const BASE = 'https://eclatcentro.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, updated_at, created_at')
    .eq('published', true)

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE}/publicaciones/${a.id}`,
    // updated_at puede venir vacío en artículos viejos: un Date inválido rompe el XML
    lastModified: new Date(a.updated_at ?? a.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/nosotros`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/servicios`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/formacion`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/publicaciones`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contacto`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
    ...articleUrls,
  ]
}
