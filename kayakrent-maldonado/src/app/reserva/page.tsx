import { supabase } from '@/lib/supabaseClient'
import ReservationForm from '@/src/components/ReservationForm'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ReservaPage() {
  const { data: kayakTypes } = await supabase
    .from('kayak_types')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            KayakRent Maldonado
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Reserva tu Kayak</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Completa el formulario para reservar tu aventura en las aguas de Maldonado
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ℹ️ Información importante
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Las reservas deben realizarse con al menos 24 horas de anticipación</li>
            <li>• Confirmaremos tu reserva por correo electrónico o teléfono</li>
            <li>• El pago se realiza al momento del retiro</li>
            <li>• Todos nuestros kayaks incluyen chalecos salvavidas y remos</li>
          </ul>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <Suspense fallback={<div className="text-center py-8">Cargando formulario...</div>}>
            {kayakTypes && kayakTypes.length > 0 ? (
              <ReservationForm kayakTypes={kayakTypes} />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Lo sentimos, actualmente no hay kayaks disponibles para reserva.
                </p>
                <Link 
                  href="/"
                  className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Volver al inicio
                </Link>
              </div>
            )}
          </Suspense>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            ¿Tienes preguntas? Contáctanos
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="tel:+59899123456" className="text-blue-600 hover:text-blue-700">
              📞 +598 99 123 456
            </a>
            <a href="mailto:info@kayakrentmaldonado.com" className="text-blue-600 hover:text-blue-700">
              📧 info@kayakrentmaldonado.com
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            © 2026 KayakRent Maldonado. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
