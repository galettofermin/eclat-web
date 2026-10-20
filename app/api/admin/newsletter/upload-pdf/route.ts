import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const fd = await req.formData()
  const file = fd.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Solo se permiten archivos PDF' }, { status: 400 })

  // Nombre limpio: sin espacios ni caracteres raros
  const nombreLimpio = file.name
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita tildes
    .replace(/[^a-zA-Z0-9._-]/g, '_')                // reemplaza espacios y símbolos
  const filePath = `newsletter/pdf/${Date.now()}_${nombreLimpio}`

  const supabase = createAdminClient()
  const { error } = await supabase.storage
    .from('servicios')
    .upload(filePath, file, { upsert: true, contentType: 'application/pdf' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(filePath)
  return NextResponse.json({ url: publicUrl, nombre: file.name })
}
