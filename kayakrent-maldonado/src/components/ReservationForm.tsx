'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

type KayakType = { 
  id: string
  name: string
  description?: string | null
  stock?: number | null
  price_per_day?: number | null
  capacity?: number | null
}

type DeliveryMode = 'pickup' | 'home' | 'custom'

export default function ReservationForm({ kayakTypes }: { kayakTypes: KayakType[] }) {
  const router = useRouter()
  const [selectedKayak, setSelectedKayak] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('1')
  const [date, setDate] = useState<string>('')
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('pickup')
  const [customLocation, setCustomLocation] = useState<string>('')
  const [homeAddress, setHomeAddress] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const minDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const handleKayakChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSelectedKayak(e.target.value), [])
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value), [])
  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value), [])
  const handleDeliveryModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setDeliveryMode(e.target.value as DeliveryMode), [])
  const handleHomeAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setHomeAddress(e.target.value), [])
  const handleCustomLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomLocation(e.target.value), [])
  const handleCustomerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value), [])
  const handleCustomerEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value), [])
  const handleCustomerPhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value), [])
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Validaciones
      if (!selectedKayak || !date) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
        throw new Error('Por favor completa tus datos de contacto')
      }

      if (deliveryMode === 'home' && !homeAddress.trim()) {
        throw new Error('Por favor ingresa tu dirección de entrega')
      }

      if (deliveryMode === 'custom' && !customLocation.trim()) {
        throw new Error('Por favor ingresa el punto de retiro personalizado')
      }

      const quantityNum = parseInt(quantity, 10)
      if (quantity === '' || Number.isNaN(quantityNum) || quantityNum < 1) {
        throw new Error('Por favor indica una cantidad válida (mínimo 1)')
      }

      // Opcionales: enviar null explícito si están vacíos o no aplican (evita filas incompletas en BD)
      const toNull = (v: string | undefined): string | null =>
        (v === undefined || v === '' || (typeof v === 'string' && !v.trim())) ? null : v.trim()

      const reservationData = {
        kayakTypeId: selectedKayak,
        date,
        quantity: quantityNum,
        deliveryMode,
        customLocation: deliveryMode === 'custom' ? toNull(customLocation) : null,
        homeAddress: deliveryMode === 'home' ? toNull(homeAddress) : null,
        customerName,
        customerEmail,
        customerPhone,
        notes: toNull(notes),
      }

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reserva')
      }

      setMessage({ 
        type: 'success', 
        text: '¡Reserva creada exitosamente! Te contactaremos pronto para confirmar los detalles.' 
      })

      // Refrescar datos del servidor para que el stock se actualice en pantalla
      router.refresh()

      // Limpiar formulario
      setSelectedKayak('')
      setQuantity('1')
      setDate('')
      setDeliveryMode('pickup')
      setCustomLocation('')
      setHomeAddress('')
      setCustomerName('')
      setCustomerEmail('')
      setCustomerPhone('')
      setNotes('')

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al crear la reserva' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedKayakData = kayakTypes.find(k => k.id === selectedKayak)
  const quantityDisplay = Math.max(0, parseInt(quantity, 10) || 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Selección de Kayak */}
      <div>
        <label htmlFor="kayak" className="block text-sm font-medium mb-2">
          Tipo de Kayak <span className="text-red-500">*</span>
        </label>
        <select
          id="kayak"
          name="kayakTypeId"
          value={selectedKayak ?? ''}
          onChange={handleKayakChange}
          required
          autoComplete="off"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar kayak...</option>
          {kayakTypes.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name} {k.price_per_day && `- $${k.price_per_day}/día`}
            </option>
          ))}
        </select>
        {selectedKayakData && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedKayakData.description}
            </p>
            <div className="mt-2 flex gap-4 text-gray-600 dark:text-gray-400">
              {selectedKayakData.capacity && (
                <span>Capacidad: {selectedKayakData.capacity} persona(s)</span>
              )}
              {selectedKayakData.stock !== null && (
                <span>Stock: {selectedKayakData.stock} disponible(s)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fecha y Cantidad */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            Fecha de Retiro <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            min={minDate}
            value={date ?? ''}
            onChange={handleDateChange}
            required
            autoComplete="off"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Reserva con al menos 24 horas de anticipación
          </p>
        </div>

        <div>
          <label htmlFor="qty" className="block text-sm font-medium mb-2">
            Cantidad <span className="text-red-500">*</span>
          </label>
          <input
            id="qty"
            name="quantity"
            type="number"
            min={1}
            max={selectedKayakData?.stock ?? 10}
            value={quantity ?? ''}
            onChange={handleQuantityChange}
            required
            autoComplete="off"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Modalidad de Entrega */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Modalidad de Retiro/Entrega <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              name="deliveryMode"
              value="pickup"
              checked={deliveryMode === 'pickup'}
              onChange={handleDeliveryModeChange}
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium">📍 Punto Predefinido</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Retira en nuestros puntos de encuentro establecidos
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              name="deliveryMode"
              value="home"
              checked={deliveryMode === 'home'}
              onChange={handleDeliveryModeChange}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="font-medium">🏠 Entrega a Domicilio</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Te lo llevamos directamente a tu domicilio
              </div>
              {deliveryMode === 'home' && (
                <input
                  type="text"
                  placeholder="Ingresa tu dirección completa"
                  value={homeAddress ?? ''}
                  onChange={handleHomeAddressChange}
                  required
                  autoComplete="off"
                  className="w-full mt-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </label>

          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              name="deliveryMode"
              value="custom"
              checked={deliveryMode === 'custom'}
              onChange={handleDeliveryModeChange}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="font-medium">🗺️ Punto Personalizado</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Indica tu ubicación preferida para el retiro
              </div>
              {deliveryMode === 'custom' && (
                <input
                  type="text"
                  placeholder="Describe el punto de encuentro"
                  value={customLocation ?? ''}
                  onChange={handleCustomLocationChange}
                  required
                  autoComplete="off"
                  className="w-full mt-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Tus datos de contacto</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium mb-2">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName ?? ''}
              onChange={handleCustomerNameChange}
              required
              placeholder="Juan Pérez"
              autoComplete="off"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail ?? ''}
                onChange={handleCustomerEmailChange}
                required
                placeholder="juan@ejemplo.com"
                autoComplete="off"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={customerPhone ?? ''}
                onChange={handleCustomerPhoneChange}
                required
                placeholder="+598 99 123 456"
                autoComplete="off"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notes"
              value={notes ?? ''}
              onChange={handleNotesChange}
              rows={3}
              placeholder="Comentarios, preferencias o información adicional..."
              autoComplete="off"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      {selectedKayakData && date && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Resumen de tu reserva</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Kayak:</strong> {selectedKayakData.name}</p>
            <p><strong>Fecha:</strong> {new Date(date + 'T00:00:00').toLocaleDateString('es-UY', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Cantidad:</strong> {quantityDisplay} kayak(s)</p>
            {selectedKayakData.price_per_day && (
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                Total estimado: ${selectedKayakData.price_per_day * quantityDisplay}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botón de Envío */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Al confirmar tu reserva, aceptas nuestros términos y condiciones
      </p>
    </form>
  )
}
