import { createServerClient } from '@/lib/supabase/server'
import ReservationActions from '@/src/components/admin/ReservationActions'

export default async function AdminReservasPage() {
  const supabase = await createServerClient()

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      id,
      reservation_date,
      quantity,
      status,
      customer_name,
      customer_email,
      customer_phone,
      delivery_mode,
      created_at,
      kayak_types (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Error cargando reservas</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Reservas
      </h1>

      <div className="space-y-4">
        {(!reservations || reservations.length === 0) && (
          <p className="text-gray-600">No hay reservas.</p>
        )}
        {reservations?.map((res) => (
          <div
            key={res.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <p><strong>Cliente:</strong> {res.customer_name}</p>
            <p><strong>Email:</strong> {res.customer_email}</p>
            <p><strong>Teléfono:</strong> {res.customer_phone}</p>
            <p><strong>Kayak:</strong> {res.kayak_types?.name}</p>
            <p><strong>Fecha:</strong> {res.reservation_date}</p>
            <p><strong>Cantidad:</strong> {res.quantity}</p>
            <p><strong>Entrega:</strong> {res.delivery_mode}</p>
            <p><strong>Estado:</strong> {res.status}</p>
            <ReservationActions id={res.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
