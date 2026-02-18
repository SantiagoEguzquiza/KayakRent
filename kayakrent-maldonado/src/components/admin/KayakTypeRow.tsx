'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function KayakTypeRow({ type }: { type: any }) {
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: type.name ?? '',
    capacity: String(type.capacity ?? ''),
    price_per_day: String(type.price_per_day ?? ''),
    stock: String(type.stock ?? ''),
  })

  const handleSave = async () => {
    setLoading(true)
    const supabase = createBrowserClient()

    await supabase
      .from('kayak_types')
      .update({
        name: form.name,
        capacity: form.capacity ? Number(form.capacity) : null,
        price_per_day: form.price_per_day ? Number(form.price_per_day) : null,
        stock: form.stock ? Number(form.stock) : null,
      })
      .eq('id', type.id)

    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este tipo de kayak?')) return

    const supabase = createBrowserClient()
    await supabase.from('kayak_types').delete().eq('id', type.id)
    router.refresh()
  }

  if (editing) {
    return (
      <tr>
        <td className="border p-2">
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-1 w-full"
          />
        </td>

        <td className="border p-2 text-center">
          <input
            type="number"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
            className="border p-1 w-20 text-center"
          />
        </td>

        <td className="border p-2 text-center">
          <input
            type="number"
            step="0.01"
            value={form.price_per_day}
            onChange={(e) =>
              setForm({
                ...form,
                price_per_day: e.target.value,
              })
            }
            className="border p-1 w-24 text-center"
          />
        </td>

        <td className="border p-2 text-center">
          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
            className="border p-1 w-20 text-center"
          />
        </td>

        <td className="border p-2 text-center space-x-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-green-600"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-gray-500"
          >
            Cancelar
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className="border p-2">{type.name}</td>
      <td className="border p-2 text-center">
        {type.capacity}
      </td>
      <td className="border p-2 text-center">
        ${type.price_per_day}
      </td>
      <td className="border p-2 text-center">
        {type.stock}
      </td>
      <td className="border p-2 text-center space-x-2">
        <button
          onClick={() => setEditing(true)}
          className="text-blue-600"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600"
        >
          Borrar
        </button>
      </td>
    </tr>
  )
}
