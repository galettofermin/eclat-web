import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const fd = await req.formData()
  const file = fd.get('file') as File | null
  const bucket = (fd.get('bucket') as string) || 'servicios'
  const path = fd.get('path') as string | null

  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filePath = path ?? `upload-${Date.now()}.${ext}`

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return NextResponse.json({ url: publicUrl })
}
