import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      kayakTypeId, 
      date, 
      quantity, 
      deliveryMode, 
      customLocation, 
      homeAddress,
      customerName,
      customerEmail,
      customerPhone,
      notes
    } = body

    // Validaciones
    if (!kayakTypeId || !date || !quantity || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Verificar disponibilidad de stock
    const { data: kayakType, error: kayakError } = await supabase
      .from('kayak_types')
      .select('stock, name')
      .eq('id', kayakTypeId)
      .single()

    if (kayakError) {
      return NextResponse.json(
        { error: 'Tipo de kayak no encontrado' },
        { status: 404 }
      )
    }

    if (kayakType.stock < quantity) {
      return NextResponse.json(
        { error: `Stock insuficiente. Solo hay ${kayakType.stock} kayak(s) disponibles` },
        { status: 400 }
      )
    }

    // Crear la reserva
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        kayak_type_id: kayakTypeId,
        reservation_date: date,
        quantity: quantity,
        delivery_mode: deliveryMode,
        custom_location: customLocation || null,
        home_address: homeAddress || null,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single()

    if (reservationError) {
      console.error('Error al crear reserva:', reservationError)
      return NextResponse.json(
        { error: 'Error al crear la reserva' },
        { status: 500 }
      )
    }

    // Actualizar el stock (decrementar)
    const { error: updateError } = await supabase
      .from('kayak_types')
      .update({ stock: kayakType.stock - quantity })
      .eq('id', kayakTypeId)

    if (updateError) {
      console.error('Error al actualizar stock:', updateError)
      // Nota: En producción, deberías hacer rollback de la reserva aquí
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Reserva creada exitosamente',
        reservation: reservation
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en la API de reservas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
