import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  let query = supabase
    .from('articles')
    .select('id, title, category, excerpt, image_url, created_at, published')
    .order('created_at', { ascending: false })
  // Sin sesión de admin, solo artículos publicados
  if (!(await isAdmin())) query = query.eq('published', true)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
