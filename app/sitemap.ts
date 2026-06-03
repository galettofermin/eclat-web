import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://eclatcentro.com'
  const routes = [
    { path: '/', priority: 1.0 },
    { path: '/formaciones', priority: 0.9 },
    { path: '/biblioteca', priority: 0.8 },
    { path: '/servicios', priority: 0.8 },
    { path: '/registro', priority: 0.6 },
    { path: '/login', priority: 0.5 },
  ]
  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority,
  }))
}
