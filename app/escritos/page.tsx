import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Escritos from '@/components/Escritos'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { createClient } from '@/lib/supabase/server'
import { getSiteConfig } from '@/lib/supabase/getSiteConfig'
import type { Article } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Escritos — Centro ÉCLAT',
  description: 'Ideas que cuidan. Artículos y reflexiones del equipo ÉCLAT.',
}

export const dynamic = 'force-dynamic'

export default async function EscritosPage() {
  let articles: Article[] | undefined
  try {
    const supabase = createClient()
    const { data } = await supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false })
    if (data?.length) articles = data
  } catch {}
  const siteConfig = await getSiteConfig()
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16"><Escritos articles={articles} siteConfig={siteConfig} /></div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
