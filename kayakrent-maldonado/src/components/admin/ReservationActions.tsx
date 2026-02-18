'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { useTransition } from 'react'

export default function ReservationActions({ id }: { id: string }) {
  const supabase = createBrowserClient()
  const [isPending, startTransition] = useTransition()

  const updateStatus = (status: string) => {
    if (!supabase) return
    startTransition(async () => {
      await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      window.location.reload()
    })
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => {
          if (window.confirm('¿Seguro que deseas confirmar esta reserva?')) {
            updateStatus('confirmed')
          }
        }}
        className="px-3 py-1 bg-green-600 text-white rounded"
        disabled={isPending}
      >
        Confirmar
      </button>

      <button
        onClick={() => {
          if (window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
            updateStatus('cancelled')
          }
        }}
        className="px-3 py-1 bg-red-600 text-white rounded"
        disabled={isPending}
      >
        Cancelar
      </button>
    </div>
  )
}
