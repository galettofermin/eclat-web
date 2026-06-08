/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'fwdhtdpzxvvjattbllfl.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/sobre-éclat', destination: '/nosotros', permanent: true },
      { source: '/sobre-eclat',      destination: '/nosotros', permanent: true },
      { source: '/conocer',          destination: '/nosotros', permanent: true },
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options',    value: 'nosniff' },
      { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection',          value: '1; mode=block' },
      { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
