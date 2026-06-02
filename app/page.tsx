import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/AppLayout'
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

  const waUrl = process.env.NEXT_PUBLIC_WHATSAPP || WHATSAPP_URL

  return (
    <AppLayout userEmail={userEmail} userName={userName} isDirector={isDirector}>
      <HomeMain courses={courses} greeting="" whatsappUrl={waUrl} />
      <WhatsAppFloatBtn />
    </AppLayout>
  )
}
