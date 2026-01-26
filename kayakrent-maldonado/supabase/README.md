# Configuración de la Base de Datos en Supabase

## Pasos para configurar las tablas en Supabase

### 1. Crear la tabla `kayak_types`

Ve a tu proyecto de Supabase → SQL Editor y ejecuta:

```sql
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

-- Habilitar RLS
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
```

### 2. Insertar datos de ejemplo en `kayak_types`

```sql
INSERT INTO kayak_types (name, description, capacity, price_per_day, stock) VALUES
  ('Kayak Individual', 'Kayak estable y fácil de manejar, ideal para principiantes', 1, 500, 10),
  ('Kayak Doble', 'Perfecto para parejas o amigos, mayor capacidad de carga', 2, 800, 8),
  ('Kayak de Mar', 'Diseñado para aguas abiertas y travesías largas', 1, 700, 5),
  ('Kayak Familiar', 'Kayak triple para familias con niños', 3, 1200, 4);
```

### 3. Crear la tabla `reservations`

Ejecuta todo el contenido del archivo `supabase/schema.sql` en el SQL Editor de Supabase.

## Verificar la configuración

Después de ejecutar los scripts, verifica que:

1. ✅ Las tablas `kayak_types` y `reservations` existan
2. ✅ Las políticas RLS estén activas
3. ✅ Hay datos de ejemplo en `kayak_types`
4. ✅ Las relaciones entre tablas funcionen correctamente

## Variables de entorno

Asegúrate de tener en tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

## Probar la funcionalidad

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:3000`
3. Haz clic en "Reservar Ahora" en cualquier kayak
4. Completa el formulario y envía
5. Verifica en Supabase → Table Editor → `reservations` que la reserva se guardó correctamente
