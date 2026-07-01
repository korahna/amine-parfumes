import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--fg-primary)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>{children}</main>
    </div>
  )
}
