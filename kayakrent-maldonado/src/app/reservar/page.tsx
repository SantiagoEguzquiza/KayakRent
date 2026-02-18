import { createServerClient } from '@/lib/supabase/server'
import ReservationForm from '@/src/components/public/ReservationForm'

export default async function ReservarPage() {
  const supabase = await createServerClient()

  const { data: kayakTypes } = await supabase
    .from('kayak_types')
    .select('id, name, stock, price_per_day')
    .order('name')

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Reservar kayak
      </h1>

      <ReservationForm kayakTypes={kayakTypes || []} />
    </div>
  )
}
