'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function KayakTypeForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    capacity: '',
    price_per_day: '',
    stock: '',
    image_url: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.from('kayak_types').insert({
      name: form.name,
      description: form.description || null,
      capacity: form.capacity ? Number(form.capacity) : null,
      price_per_day: form.price_per_day ? Number(form.price_per_day) : null,
      stock: form.stock ? Number(form.stock) : null,
      image_url: form.image_url || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
    setForm({
      name: '',
      description: '',
      capacity: '',
      price_per_day: '',
      stock: '',
      image_url: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-3 border-2 border-gray-300 p-4 rounded-lg bg-white shadow-sm"
    >
      <h2 className="font-semibold text-gray-900">Nuevo tipo de kayak</h2>

      <input
        name="name"
        placeholder="Nombre"
        required
        value={form.name}
        onChange={handleChange}
        className="w-full border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        className="w-full border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="capacity"
          type="number"
          placeholder="Capacidad"
          required
          value={form.capacity}
          onChange={handleChange}
          className="border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
        />

        <input
          name="price_per_day"
          type="number"
          step="0.01"
          placeholder="Precio por día"
          value={form.price_per_day}
          onChange={handleChange}
          className="border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          required
          value={form.stock}
          onChange={handleChange}
          className="border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
        />

        <input
          name="image_url"
          placeholder="URL imagen"
          value={form.image_url}
          onChange={handleChange}
          className="border-2 border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:border-gray-500 outline-none"
        />
      </div>

      {error && <p className="text-red-700 text-sm px-2 py-1 bg-red-50 border border-red-200 rounded">{error}</p>}

      <button
        disabled={loading}
        className="bg-gray-900 text-white px-4 py-2 rounded font-medium disabled:opacity-50 hover:bg-black transition-colors"
      >
        {loading ? 'Guardando...' : 'Crear tipo'}
      </button>
    </form>
  )
}
