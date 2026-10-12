import type { SupabaseClient, User } from '@supabase/supabase-js'

// Mapa email (en minúsculas) → usuario de Supabase Auth.
// listUsers pagina (50 por defecto), así que se recorren todas las páginas.
export async function usersByEmail(admin: SupabaseClient): Promise<Map<string, User>> {
  const map = new Map<string, User>()
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    data.users.forEach(u => { if (u.email) map.set(u.email.toLowerCase(), u) })
    if (data.users.length < 1000) break
  }
  return map
}

export async function findUserByEmail(admin: SupabaseClient, email: string): Promise<User | undefined> {
  return (await usersByEmail(admin)).get(email.trim().toLowerCase())
}
