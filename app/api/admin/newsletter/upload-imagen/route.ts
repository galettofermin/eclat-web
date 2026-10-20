import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const fd = await req.formData()
  const file = fd.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })

  const nombreLimpio = file.name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `newsletter/imagenes/${Date.now()}_${nombreLimpio}`

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('servicios')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(filePath)
  return NextResponse.json({ url: publicUrl })
}
