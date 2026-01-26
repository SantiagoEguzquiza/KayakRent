'use client'

type KayakType = { id: string; name: string; description?: string | null; stock?: number | null }

export default function ReservationForm({ kayakTypes }: { kayakTypes: KayakType[] }) {
  return (
    <form className="mt-6 p-4 border rounded space-y-3 max-w-md">
      <h2 className="text-lg font-semibold">Nueva reserva</h2>
      <div>
        <label htmlFor="kayak" className="block text-sm font-medium mb-1">Tipología</label>
        <select
          id="kayak"
          name="kayakTypeId"
          className="w-full border border-zinc-600 rounded px-3 py-2 bg-black text-white"
        >
          <option value="">Seleccionar...</option>
          {kayakTypes.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">Fecha</label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full border border-zinc-600 rounded px-3 py-2 bg-black text-white"
        />
      </div>
      <div>
        <label htmlFor="qty" className="block text-sm font-medium mb-1">Cantidad</label>
        <input
          id="qty"
          name="quantity"
          type="number"
          min={1}
          className="w-full border border-zinc-600 rounded px-3 py-2 bg-black text-white"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Reservar
      </button>
    </form>
  )
}
