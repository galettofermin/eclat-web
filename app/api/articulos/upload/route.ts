import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })

  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `articulo-${Date.now()}.${ext}`

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('articulos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('articulos').getPublicUrl(path)
  return NextResponse.json({ url: publicUrl })
}
