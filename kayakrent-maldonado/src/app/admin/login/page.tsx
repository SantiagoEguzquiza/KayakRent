'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Login correcto → ir al panel
    router.push('/admin')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg border-2 border-gray-300 shadow-md"
      >
        <h1 className="text-xl font-semibold mb-4 text-center text-gray-900">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-700 text-sm mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded">
            {error}
          </p>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-400 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 rounded font-medium disabled:opacity-50 hover:bg-black transition-colors"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
