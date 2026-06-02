import { createClient } from '@/lib/supabase/server'
import AppSidebar from '@/components/AppSidebar'
import HomeMain from '@/components/HomeMain'
import WhatsAppFloatBtn from '@/components/WhatsAppFloatBtn'
import { WHATSAPP_URL, DIRECTOR_EMAIL } from '@/lib/constants'
import type { Course } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let courses: Course[] | undefined
  let userName = ''
  let userEmail = ''
  let isDirector = false

  try {
    const supabase = createClient()
    const [{ data: { user } }, { data: c }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from('courses').select('*').eq('published', true).order('sort_order').limit(4),
    ])
    if (c?.length) courses = c
    if (user) {
      userEmail = user.email ?? ''
      userName = user.user_metadata?.full_name ?? userEmail.split('@')[0] ?? ''
      isDirector = user.email === DIRECTOR_EMAIL
    }
  } catch {}

  const greeting = userName ? `¡Hola, ${userName.split(' ')[0]}!` : '¡Hola!'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
      <AppSidebar userEmail={userEmail} userName={userName} isDirector={isDirector} />
      <HomeMain
        courses={courses}
        greeting={greeting}
        whatsappUrl={WHATSAPP_URL}
      />
      <WhatsAppFloatBtn />
    </div>
  )
}
