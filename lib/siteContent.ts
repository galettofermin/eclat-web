import { createClient } from '@/lib/supabase/server'

export async function getSiteContent(keys: string[]): Promise<Record<string, string>> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .in('key', keys)
    const result: Record<string, string> = {}
    data?.forEach(row => { result[row.key] = row.value })
    return result
  } catch {
    return {}
  }
}
