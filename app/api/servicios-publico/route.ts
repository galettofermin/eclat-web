import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from('servicios')
    .select('nombre, imagen_url')
    .not('imagen_url', 'is', null);
  return NextResponse.json(data || []);
}
