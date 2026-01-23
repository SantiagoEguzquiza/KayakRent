HOJA DE RUTA – KayakRent Maldonado (Next.js + Supabase)
Decisiones confirmadas (MVP)
- Reserva: por día completo (no franjas horarias).
- Inventario: por tipología con stock.
- Usuario final: sin login (reserva como invitado).
- Administración: panel admin con autenticación (Supabase Auth).
- Pagos: fuera de alcance por ahora.

============================================================
FASE 0 – Preparación (0.5 día)
Objetivo: dejar cerradas reglas y alcances para evitar retrabajo.

0.1 Reglas de negocio (cerradas)
- Anticipación mínima: 24 horas.
- Reserva por día completo: una fecha representa el día reservado.
- Stock por tipología: se valida disponibilidad por fecha y tipología.
- Modalidad logística:
  - MEETING_POINT: punto predefinido por arrendador
  - DELIVERY_ADDRESS: entrega a domicilio
  - CUSTOM_POINT: punto indicado por el cliente

0.2 Definir estados de reserva (recomendado)
- PENDING: creada (pendiente de confirmación manual si aplica)
- CONFIRMED: confirmada (bloquea stock)
- CANCELLED: cancelada (libera stock)
- COMPLETED: finalizada (histórico)

0.3 Alcance del MVP (cerrado)
- Catálogo público de tipologías
- Consulta de disponibilidad por fecha
- Creación de reserva (invitado)
- Panel admin (CRUD tipologías, puntos, reservas)
- Sin pagos
- Notificaciones por email: opcional (no crítica)

============================================================
FASE 1 – Setup del repositorio y Next.js (día 1)
Objetivo: proyecto base estable y listo para iterar.

1.1 Repositorio
- Crear repo en GitHub (ej. kayakrent-maldonado)
- Agregar README.md (ya definido en el proyecto)
- Configurar .gitignore (incluye .env.local)

1.2 Inicializar Next.js (App Router + TS + Tailwind)
- create-next-app con:
  - TypeScript: Sí
  - ESLint: Sí
  - Tailwind: Sí
  - App Router: Sí
  - Alias: @/*

1.3 Estructura recomendada
- app/
  - page.tsx
  - kayaks/
  - checkout/
  - admin/
  - api/
- lib/
  - supabase/
- db/ (opcional, migrations SQL)
- components/

1.4 Primer commit
- Verificar npm run dev
- Commit inicial

============================================================
FASE 2 – Supabase: proyecto, BD y seguridad (día 1–2)
Objetivo: base de datos coherente, segura y lista para producción.

2.1 Crear proyecto en Supabase
- Elegir región cercana (Brasil)
- Guardar:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (solo server)

2.2 Definir esquema de BD (MVP)
Tablas mínimas:
- kayak_types
  - id, name, description, capacity, price_per_day, stock_total, is_active, image_url
- meeting_points
  - id, name, address, lat, lng, is_active
- reservations
  - id, reservation_date, status, customer_name, customer_phone, customer_email
  - delivery_mode, delivery_address, custom_point_text
  - meeting_point_id (nullable)
  - created_at
- reservation_items
  - id, reservation_id, kayak_type_id, quantity, unit_price

Constraints recomendadas:
- quantity > 0
- stock_total >= 0
- reservation_date debe ser una fecha (sin hora)
- Integridad referencial con FK

2.3 RLS (Row Level Security) y políticas
- Public read:
  - kayak_types: SELECT (solo is_active = true)
  - meeting_points: SELECT (solo is_active = true)
- Escrituras de reservas:
  - Recomendación: deshabilitar INSERT directo desde cliente y hacer INSERT solo vía API server-side.
- Admin:
  - Supabase Auth + rol admin (profiles/app_metadata)
  - Políticas de UPDATE/DELETE solo admin

2.4 Seeds de datos (recomendado)
- Insertar 2–4 tipologías de ejemplo
- Insertar 2–3 puntos de encuentro

============================================================
FASE 3 – Integración Next.js + Supabase (día 2)
Objetivo: separar correctamente cliente/servidor y variables de entorno.

3.1 Variables de entorno (.env.local)
- NEXT_PUBLIC_SUPABASE_URL=...
- NEXT_PUBLIC_SUPABASE_ANON_KEY=...
- SUPABASE_SERVICE_ROLE_KEY=... (solo servidor)

3.2 Clientes Supabase
- lib/supabase/client.ts (anon key para lecturas públicas)
- lib/supabase/server.ts (service role para operaciones sensibles)

3.3 Convención de seguridad
- La service role key NUNCA se usa en el navegador.
- Las operaciones que crean/actualizan reservas pasan por Route Handlers en app/api.

============================================================
FASE 4 – Catálogo público (día 2–3)
Objetivo: sitio navegable con información suficiente para reservar.

4.1 Home (/)
- Propuesta de valor, CTA “Reservar”
- Sección “Cómo funciona” (24h anticipación, modalidades de entrega)

4.2 Listado de tipologías (/kayaks)
- Mostrar: nombre, capacidad, precio por día, stock, imagen (si aplica)

4.3 Detalle de tipología (/kayaks/[id])
- Descripción
- CTA a flujo de reserva

============================================================
FASE 5 – Núcleo: disponibilidad y reserva (día 3–4)
Objetivo: reservar sin sobre-reservas, con validación de reglas.

5.1 Endpoint: disponibilidad
- GET /api/availability?date=YYYY-MM-DD
Respuesta:
- Por tipología: stock_total, reservado_confirmado, disponible

Cálculo:
- Sumar reservation_items de reservas status CONFIRMED para la fecha.
- disponible = stock_total - reservado_confirmado

5.2 Formulario de reserva (/checkout)
Inputs:
- Fecha (mínimo hoy+1)
- Items: tipología + cantidad
- Modalidad de entrega (MEETING_POINT / DELIVERY_ADDRESS / CUSTOM_POINT)
- Datos cliente: nombre, teléfono, email (email opcional si no se enviarán notificaciones)

Validaciones:
- Fecha >= hoy + 1 día
- Cantidades > 0
- Si MEETING_POINT => meeting_point_id requerido
- Si DELIVERY_ADDRESS => address requerido
- Si CUSTOM_POINT => descripción del punto requerida

5.3 Endpoint: crear reserva
- POST /api/reservations
- Validar reglas (24h, inputs, stock)
- Crear reservations + reservation_items en transacción
- Estado sugerido:
  - CONFIRMED si el negocio confirma automáticamente
  - PENDING si requiere confirmación manual del arrendador

Mecanismo anti-sobrerreserva:
- Validar disponibilidad en la misma operación de creación.
- Si el stock disponible es insuficiente => devolver error.

============================================================
FASE 6 – Panel de administración (día 4–5)
Objetivo: operación diaria simple para el arrendador.

6.1 Auth admin
- Login con Supabase Auth
- Asignar rol admin (profiles/app_metadata)

6.2 Admin UI (/admin)
Módulos:
- Tipologías (CRUD): stock_total, precio, activo/inactivo, imagen
- Puntos de encuentro (CRUD): activo/inactivo
- Reservas:
  - listado por fecha/estado
  - detalle
  - acciones: confirmar (si PENDING), cancelar, marcar completada

6.3 Endpoints admin (server-side)
- /api/admin/kayak-types
- /api/admin/meeting-points
- /api/admin/reservations

============================================================
FASE 7 – Calidad mínima y cierre MVP (día 5)
Objetivo: estabilidad, mensajes claros y checklist de producción.

7.1 UX
- Estados de carga
- Mensajes de validación
- Confirmación post-reserva con resumen (fecha, items, modalidad, contacto)

7.2 Observabilidad básica
- Logs en endpoints críticos
- Manejo consistente de errores (códigos y mensajes)

7.3 Seguridad
- Verificar RLS efectiva
- Verificar que no existan escrituras sensibles desde el cliente

============================================================
FASE 8 – Despliegue (día 5)
Objetivo: producción operativa con mantenimiento mínimo.

8.1 Vercel
- Importar repo
- Configurar variables de entorno
- Deploy automático al hacer push

8.2 Supabase
- Revisar RLS y políticas
- Validar reservas en entorno productivo

============================================================
FASE 9 – Mejoras post-MVP (opcional)
- Email de confirmación/cancelación (Resend/Mailgun)
- Reportes simples (reservas por fecha, ingresos estimados)
- Fotos optimizadas y SEO
- Multi-idioma ES/EN
- Integración pagos (cuando aplique)
