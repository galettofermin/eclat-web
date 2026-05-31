import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Services from '@/components/Services'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { createClient } from '@/lib/supabase/server'
import { getSiteConfig } from '@/lib/supabase/getSiteConfig'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Servicios — Centro ÉCLAT',
  description: 'Psicología, Psicopedagogía, Fonoaudiología, Psicomotricidad, Arteterapia y más.',
}

export const dynamic = 'force-dynamic'

export default async function ServiciosPage() {
  let services: Service[] | undefined
  try {
    const supabase = createClient()
    const { data } = await supabase.from('services').select('*').eq('published', true).order('sort_order')
    if (data?.length) services = data
  } catch {}
  const siteConfig = await getSiteConfig()
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16"><Services services={services} siteConfig={siteConfig} /></div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
