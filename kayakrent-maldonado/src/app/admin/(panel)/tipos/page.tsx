import { createServerClient } from '@/lib/supabase/server'
import KayakTypeForm from '@/src/components/admin/KayakTypeForm'
import KayakTypeRow from '@/src/components/admin/KayakTypeRow'

export default async function KayakTypesPage() {
  const supabase = await createServerClient()
  const { data: types } = await supabase
    .from('kayak_types')
    .select('*')
    .order('created_at')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Tipos de Kayak</h1>

      <KayakTypeForm />

      <div className="border-2 border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Capacidad</th>
              <th className="p-2 border">Precio/día</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {types?.map((type) => (
              <KayakTypeRow key={type.id} type={type} />
            ))}
          </tbody>
        </table>
        {(!types || types.length === 0) && (
          <p className="p-4 text-gray-600 text-center">No hay tipos de kayak.</p>
        )}
      </div>
    </div>
  )
}
