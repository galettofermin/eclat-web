import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = { title: 'Admin — Centro ÉCLAT' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <html lang="es">
        <body>{children}</body>
      </html>
    )
  }

  return (
    <AdminShell userEmail={user.email ?? ''}>
      {children}
    </AdminShell>
  )
}
