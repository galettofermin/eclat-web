import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Formation from '@/components/Formation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { createClient } from '@/lib/supabase/server'
import { getSiteConfig } from '@/lib/supabase/getSiteConfig'
import type { Course } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Formación — Centro ÉCLAT',
  description: 'Cursos y materiales formativos del equipo ÉCLAT.',
}

export const dynamic = 'force-dynamic'

export default async function FormacionPage() {
  let courses: Course[] | undefined
  try {
    const supabase = createClient()
    const { data } = await supabase.from('courses').select('*').eq('published', true).order('sort_order')
    if (data?.length) courses = data
  } catch {}
  const siteConfig = await getSiteConfig()
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16"><Formation courses={courses} siteConfig={siteConfig} /></div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
