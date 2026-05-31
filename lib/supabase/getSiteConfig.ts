import { createClient } from '@/lib/supabase/server'

export async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_config').select('*')
    const config: Record<string, string> = {}
    data?.forEach((row) => { config[row.key] = row.value })
    return config
  } catch {
    return {}
  }
}
