import { MetadataRoute } from 'next'

const BASE = 'https://eclatcentro.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/conocer`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/servicios`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/formacion`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/publicaciones`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contacto`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]
}
