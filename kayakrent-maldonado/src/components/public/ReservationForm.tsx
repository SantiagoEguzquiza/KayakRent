'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function ReservationForm({
  kayakTypes,
}: {
  kayakTypes: any[]
}) {
  const supabase = createBrowserClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    kayak_type_id: '',
    reservation_date: '',
    quantity: 1,
    delivery_mode: 'pickup',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'quantity' ? Number(value) || 1 : value })
  }

  const checkAvailability = async () => {
    if (!supabase) return false
    const { data: reservations } = await supabase
      .from('reservations')
      .select('quantity')
      .eq('kayak_type_id', form.kayak_type_id)
      .eq('reservation_date', form.reservation_date)
      .neq('status', 'cancelled')

    const reserved =
      reservations?.reduce(
        (sum, r) => sum + r.quantity,
        0
      ) || 0

    const type = kayakTypes.find(
      (k) => k.id === form.kayak_type_id
    )
    const stock = type?.stock ?? 0

    return stock - reserved >= form.quantity
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const available = await checkAvailability()

    if (!available) {
      setError(
        'No hay stock disponible para ese día.'
      )
      setLoading(false)
      return
    }

    if (!supabase) return
    const { error } = await supabase.rpc('create_reservation_safe', {
      p_kayak_type_id: form.kayak_type_id,
      p_reservation_date: form.reservation_date,
      p_quantity: Number(form.quantity),
      p_delivery_mode: form.delivery_mode,
      p_customer_name: form.customer_name,
      p_customer_email: form.customer_email,
      p_customer_phone: form.customer_phone,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <p className="text-green-600">
        Reserva enviada correctamente.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <select
        name="kayak_type_id"
        required
        value={form.kayak_type_id}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">
          Seleccionar tipo
        </option>
        {kayakTypes.map((k) => (
          <option key={k.id} value={k.id}>
            {k.name} (${k.price_per_day}/día)
          </option>
        ))}
      </select>

      <input
        type="date"
        name="reservation_date"
        required
        value={form.reservation_date}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="number"
        name="quantity"
        min={1}
        value={form.quantity}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <select
        name="delivery_mode"
        value={form.delivery_mode}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="pickup">
          Retiro en punto
        </option>
        <option value="home">
          Entrega a domicilio
        </option>
        <option value="custom">
          Punto personalizado
        </option>
      </select>

      <input
        name="customer_name"
        placeholder="Nombre"
        required
        value={form.customer_name}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        name="customer_email"
        type="email"
        placeholder="Email"
        required
        value={form.customer_email}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        name="customer_phone"
        placeholder="Teléfono"
        required
        value={form.customer_phone}
        onChange={handleChange}
        className="w-full border p-2"
      />

      {error && (
        <p className="text-red-600 text-sm">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? 'Enviando...' : 'Reservar'}
      </button>
    </form>
  )
}
