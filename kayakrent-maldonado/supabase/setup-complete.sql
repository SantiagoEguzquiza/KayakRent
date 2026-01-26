-- SCRIPT COMPLETO PARA CONFIGURAR LA BASE DE DATOS DE KAYAKRENT
-- Este script maneja tanto la creación nueva como la actualización de tablas existentes

-- ============================================
-- 1. ELIMINAR Y RECREAR TABLA kayak_types
-- ============================================

-- Primero eliminamos reservations si existe (por la foreign key)
DROP TABLE IF EXISTS reservations CASCADE;

-- Luego eliminamos kayak_types
DROP TABLE IF EXISTS kayak_types CASCADE;

-- Crear tabla kayak_types desde cero
CREATE TABLE kayak_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER,
  price_per_day DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para kayak_types
ALTER TABLE kayak_types ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Anyone can read kayak_types"
  ON kayak_types
  FOR SELECT
  USING (true);

-- Política: Solo autenticados pueden insertar/actualizar/eliminar
CREATE POLICY "Authenticated users can manage kayak_types"
  ON kayak_types
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 2. INSERTAR DATOS DE EJEMPLO EN kayak_types
-- ============================================

INSERT INTO kayak_types (name, description, capacity, price_per_day, stock) 
VALUES
  ('Kayak Individual', 'Kayak estable y fácil de manejar, ideal para principiantes', 1, 500, 10),
  ('Kayak Doble', 'Perfecto para parejas o amigos, mayor capacidad de carga', 2, 800, 8),
  ('Kayak de Mar', 'Diseñado para aguas abiertas y travesías largas', 1, 700, 5),
  ('Kayak Familiar', 'Kayak triple para familias con niños', 3, 1200, 4);

-- ============================================
-- 3. CREAR TABLA reservations CON TODAS LAS COLUMNAS
-- ============================================

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kayak_type_id UUID NOT NULL REFERENCES kayak_types(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('pickup', 'home', 'custom')),
  custom_location TEXT,
  home_address TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREAR ÍNDICES
-- ============================================

CREATE INDEX idx_reservations_kayak_type ON reservations(kayak_type_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_customer_email ON reservations(customer_email);

-- ============================================
-- 5. CREAR TRIGGER PARA updated_at
-- ============================================

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

-- ============================================
-- 6. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer las reservas
CREATE POLICY "Anyone can read reservations"
  ON reservations
  FOR SELECT
  USING (true);

-- Política: Cualquiera puede insertar reservas (para permitir reservas públicas)
CREATE POLICY "Anyone can insert reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete reservations"
  ON reservations
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 7. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE reservations IS 'Tabla que almacena todas las reservas de kayaks';
COMMENT ON COLUMN reservations.delivery_mode IS 'Modalidad de entrega: pickup (punto predefinido), home (domicilio), custom (punto personalizado)';
COMMENT ON COLUMN reservations.status IS 'Estado de la reserva: pending (pendiente), confirmed (confirmada), cancelled (cancelada), completed (completada)';
COMMENT ON COLUMN reservations.custom_location IS 'Ubicación personalizada cuando delivery_mode es custom';
COMMENT ON COLUMN reservations.home_address IS 'Dirección de domicilio cuando delivery_mode es home';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Para verificar que todo se creó correctamente, ejecuta:
SELECT 'kayak_types' as tabla, COUNT(*) as registros FROM kayak_types
UNION ALL
SELECT 'reservations' as tabla, COUNT(*) as registros FROM reservations;
