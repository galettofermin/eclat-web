import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('servicios')
      .select('nombre, imagen_url')
      .not('imagen_url', 'is', null);

    console.log('servicios-publico data:', data, 'error:', error);
    return NextResponse.json(data || []);
  } catch (e) {
    console.error('servicios-publico error:', e);
    return NextResponse.json([]);
  }
}
