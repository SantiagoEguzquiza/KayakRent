import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/src/components/admin/LogoutButton'

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-lg">KayakRent Admin</div>
        <nav className="px-4 space-y-2 text-sm">
          <a href="/admin/reservas" className="block hover:underline">
            Reservas
          </a>
          <a href="/admin/kayaks" className="block hover:underline">
            Kayaks
          </a>
          <a href="/admin/tipos" className="block hover:underline">
            Tipos
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex items-center justify-between bg-white border-b px-6 py-4">
          <span className="text-sm text-gray-600">
            Panel de administración
          </span>
          <LogoutButton />
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  )
}
