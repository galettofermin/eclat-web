import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CoursesCarousel from '@/components/course/CoursesCarousel'
import About from '@/components/About'
import Services from '@/components/Services'
import Formation from '@/components/Formation'
import PausaBento from '@/components/PausaBento'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import type { Article, Course, Service } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let articles: Article[] | undefined
  let courses: Course[] | undefined
  let services: Service[] | undefined
  let siteConfig: Record<string, string> | undefined

  try {
    const supabase = createClient()
    const [a, c, s, cfg] = await Promise.all([
      supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false }),
      supabase.from('courses').select('*').eq('published', true).order('sort_order'),
      supabase.from('services').select('*').eq('published', true).order('sort_order'),
      supabase.from('site_config').select('*'),
    ])
    if (a.data?.length) articles = a.data
    if (c.data?.length) courses = c.data
    if (s.data?.length) services = s.data
    if (cfg.data?.length) {
      siteConfig = {}
      cfg.data.forEach((row) => { siteConfig![row.key] = row.value })
    }
  } catch { /* fallback a datos hardcodeados */ }

  // Curso destacado: el primero con precio > 0 (pago) o el primero disponible
  const featuredCourse = courses?.find(c => !c.is_free && c.price > 0) ?? courses?.[0] ?? null

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <Hero siteConfig={siteConfig} featuredCourse={featuredCourse} />
      <CoursesCarousel courses={courses} />
      <About siteConfig={siteConfig} />
      <Services services={services} siteConfig={siteConfig} />
      <Formation courses={courses} siteConfig={siteConfig} />
      <PausaBento articles={articles} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
