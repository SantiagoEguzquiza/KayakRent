# Hoja de Ruta – KayakRent Maldonado  
**Stack:** Next.js + Supabase  
**Objetivo:** MVP funcional, simple y estable para reservas de kayaks

---

## Decisiones confirmadas (MVP)

- **Reserva:** por día completo (no franjas horarias).
- **Inventario:** por tipología con stock.
- **Usuario final:** sin login (reserva como invitado).
- **Administración:** panel admin con autenticación (Supabase Auth).
- **Pagos:** fuera de alcance por el momento.

---

## FASE 0 – Preparación (0.5 día)

### Reglas de negocio
- Anticipación mínima: **24 horas**.
- Una fecha representa **un día completo** de reserva.
- Stock validado por tipología y fecha.
- Modalidades de entrega:
  - `MEETING_POINT` – Punto predefinido por el arrendador.
  - `DELIVERY_ADDRESS` – Entrega a domicilio.
  - `CUSTOM_POINT` – Punto indicado por el cliente.

### Estados de reserva
- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

### Alcance del MVP
- Catálogo público de tipologías.
- Consulta de disponibilidad.
- Creación de reservas como invitado.
- Panel de administración.
- Sin pagos.
- Emails opcionales (post-MVP).

---

## FASE 1 – Setup del proyecto (Día 1)

- Crear repositorio GitHub (`kayakrent-maldonado`).
- Inicializar Next.js:
  - App Router
  - TypeScript
  - Tailwind CSS
  - ESLint
- Estructura base:
  - `app/`
  - `lib/`
  - `components/`
  - `db/`
- Primer commit funcional.

---

## FASE 2 – Supabase: Base de datos y seguridad (Día 1–2)

### Base de datos (tablas mínimas)
- `kayak_types`
- `meeting_points`
- `reservations`
- `reservation_items`

### Seguridad
- RLS habilitado en todas las tablas.
- Lectura pública:
  - `kayak_types` (solo activos).
  - `meeting_points` (solo activos).
- Escrituras solo vía backend.
- Admin autenticado con Supabase Auth.

---

## FASE 3 – Integración Next.js + Supabase (Día 2)

- Variables de entorno:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Cliente Supabase:
  - Browser (anon).
  - Server (service role).
- Operaciones críticas solo en Route Handlers.

---

## FASE 4 – Catálogo público (Día 2–3)

- Home con propuesta de valor.
- Listado de kayaks (`/kayaks`).
- Detalle de tipología (`/kayaks/[id]`).

---

## FASE 5 – Reservas y disponibilidad (Día 3–4)

### Endpoints
- `GET /api/availability`
- `POST /api/reservations`

### Validaciones
- Fecha >= hoy + 1 día.
- Stock suficiente.
- Datos de entrega obligatorios según modalidad.

### Anti-sobrerreserva
- Cálculo de disponibilidad en transacción.
- Error si no hay stock.

---

## FASE 6 – Panel Admin (Día 4–5)

- Login admin (Supabase Auth).
- CRUD de:
  - Tipologías.
  - Puntos de encuentro.
- Gestión de reservas:
  - Confirmar.
  - Cancelar.
  - Completar.

---

## FASE 7 – Cierre MVP (Día 5)

- Manejo de errores.
- Estados de carga.
- Confirmación visual de reserva.
- Verificación de RLS.

---

## FASE 8 – Despliegue (Día 5)

- **Vercel**:
  - Deploy automático.
  - Variables de entorno.
- **Supabase**:
  - Validar políticas.
  - Pruebas en producción.

---

## FASE 9 – Mejoras futuras

- Emails automáticos.
- Reportes.
- SEO.
- Multi-idioma.
- Pagos online.

---

