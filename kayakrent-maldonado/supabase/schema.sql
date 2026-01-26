-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kayak_type_id UUID NOT NULL REFERENCES kayak_types(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('pickup', 'home', 'custom')),
  custom_location TEXT,
  home_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reservations_kayak_type ON reservations(kayak_type_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer las reservas (puedes restringir esto más adelante)
CREATE POLICY "Anyone can read reservations"
  ON reservations
  FOR SELECT
  USING (true);

-- Política: Cualquiera puede insertar reservas (para permitir reservas públicas)
CREATE POLICY "Anyone can insert reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar (para el panel admin)
CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete reservations"
  ON reservations
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE reservations IS 'Tabla que almacena todas las reservas de kayaks';
COMMENT ON COLUMN reservations.delivery_mode IS 'Modalidad de entrega: pickup (punto predefinido), home (domicilio), custom (punto personalizado)';
COMMENT ON COLUMN reservations.status IS 'Estado de la reserva: pending (pendiente), confirmed (confirmada), cancelled (cancelada), completed (completada)';
