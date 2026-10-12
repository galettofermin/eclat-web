import type { Metadata } from 'next'
import About from '@/components/About'
import { getSiteConfig } from '@/lib/supabase/getSiteConfig'

export const metadata: Metadata = {
  title: 'Sobre ÉCLAT — Centro de Atención Integral',
  description: 'Conocé la misión, los valores y el enfoque del Centro ÉCLAT.',
}

export const dynamic = 'force-dynamic'

export default async function SobrePage() {
  const siteConfig = await getSiteConfig()
  return (
    <main className="min-h-screen bg-white">
      <div><About siteConfig={siteConfig} /></div>
    </main>
  )
}
