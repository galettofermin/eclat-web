import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import About from '@/components/About'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
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
      <Navbar />
      <div className="pt-16"><About siteConfig={siteConfig} /></div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
