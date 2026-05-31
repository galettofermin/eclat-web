import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'

export const metadata = { title: 'Admin — Centro ÉCLAT' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Sin usuario → middleware ya redirigió a login; este layout solo renderiza el form
  if (!user) {
    return (
      <html lang="es">
        <body>{children}</body>
      </html>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans">
      <AdminNav userEmail={user.email ?? ''} />
      <main style={{ paddingLeft: 232 }} className="min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
