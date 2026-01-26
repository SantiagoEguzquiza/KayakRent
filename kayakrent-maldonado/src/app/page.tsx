import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type KayakType = {
  id: string
  name: string
  description?: string | null
  capacity?: number | null
  price_per_day?: number | null
  stock?: number | null
  image_url?: string | null
}

export default async function HomePage() {
  const { data: kayakTypes } = await supabase
    .from('kayak_types')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            KayakRent Maldonado
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Explora las aguas de Maldonado en kayak
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Reserva tu kayak con al menos 24 horas de anticipación y disfruta de una experiencia única en la naturaleza
          </p>
          <Link
            href="#kayaks"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ver Kayaks Disponibles
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚣</div>
              <h3 className="text-xl font-semibold mb-3">Kayaks de Calidad</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Equipos modernos y bien mantenidos para tu seguridad y comodidad
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-3">Puntos de Retiro</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Múltiples ubicaciones o entrega a domicilio según tu preferencia
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-3">Reserva Anticipada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sistema de reservas 24hs antes para garantizar disponibilidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kayak Types Section */}
      <section id="kayaks" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Kayaks</h2>
          
          {kayakTypes && kayakTypes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kayakTypes.map((kayak: KayakType) => (
                <div
                  key={kayak.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
                >
                  {kayak.image_url ? (
                    <img
                      src={kayak.image_url}
                      alt={kayak.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                      <span className="text-6xl">🚣</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{kayak.name}</h3>
                    {kayak.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        {kayak.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm">
                      {kayak.capacity && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Capacidad:</span>
                          <span>{kayak.capacity} persona{kayak.capacity > 1 ? 's' : ''}</span>
                        </p>
                      )}
                      {kayak.price_per_day && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Precio:</span>
                          <span className="text-lg font-bold text-blue-600">${kayak.price_per_day}/día</span>
                        </p>
                      )}
                      {kayak.stock !== null && kayak.stock !== undefined && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Disponibles:</span>
                          <span className={kayak.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {kayak.stock > 0 ? `${kayak.stock} unidad${kayak.stock > 1 ? 'es' : ''}` : 'Sin stock'}
                          </span>
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/reserva?kayakId=${kayak.id}`}
                      className="mt-4 block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Reservar Ahora
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Actualmente no hay kayaks disponibles
              </p>
              <p className="text-gray-500">
                Vuelve pronto para ver nuestras opciones
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Delivery Options Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Modalidades de Retiro/Entrega</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Punto Predefinido
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Retira en nuestros puntos de encuentro establecidos
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                Entrega a Domicilio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Te lo llevamos directamente a tu domicilio
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                Punto Personalizado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Indica tu ubicación preferida para el retiro
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2 font-semibold">KayakRent Maldonado</p>
          <p className="text-gray-400 text-sm">
            Tu aventura en kayak comienza aquí
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 KayakRent Maldonado. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
