import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/login'] },
    ],
    sitemap: 'https://eclatcentro.com/sitemap.xml',
  }
}
