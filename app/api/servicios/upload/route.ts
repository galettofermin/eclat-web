import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const nombre = (formData.get('nombre') as string) || 'servicio'

  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const slug = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')
  const path = `${slug}-${Date.now()}.${ext}`

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('servicios')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(path)
  return NextResponse.json({ url: publicUrl })
}
