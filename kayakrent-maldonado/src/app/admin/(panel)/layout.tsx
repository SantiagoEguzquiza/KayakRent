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
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-gray-300 shadow-sm">
        <div className="p-4 font-bold text-lg text-gray-900 border-b border-gray-300">
          KayakRent Admin
        </div>
        <nav className="px-4 py-3 space-y-1 text-sm">
          <a href="/admin/reservas" className="block py-2 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded px-2">
            Reservas
          </a>
          <a href="/admin/kayaks" className="block py-2 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded px-2">
            Kayaks
          </a>
          <a href="/admin/tipos" className="block py-2 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded px-2">
            Tipos
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-100">
        <header className="flex items-center justify-between bg-white border-b-2 border-gray-300 px-6 py-4 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            Panel de administración
          </span>
          <LogoutButton />
        </header>

        <section className="p-6 flex-1 text-gray-900">{children}</section>
      </main>
    </div>
  )
}
