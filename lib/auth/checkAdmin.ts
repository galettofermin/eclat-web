import { createClient } from '@/lib/supabase/server'
import { DIRECTOR_EMAIL } from '@/lib/constants'

// Admin = usuario con sesión de Supabase cuyo email es el del director
// (mismo criterio que /api/auth/check y el middleware de /admin).
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email === DIRECTOR_EMAIL
  } catch {
    return false
  }
}
