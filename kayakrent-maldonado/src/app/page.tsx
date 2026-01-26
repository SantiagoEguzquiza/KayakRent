import { supabase } from '@/lib/supabaseClient'
import ReservationForm from '@/src/components/ReservationForm'

export default async function Home() {
  const { data: kayakTypes } = await supabase
    .from('kayak_types')
    .select('*')
    .order('name')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Reserva tu Kayak en Maldonado
      </h1>

      <ReservationForm kayakTypes={kayakTypes || []} />
    </main>
  )
}
