# KayakRent Maldonado

## Descripción

**KayakRent Maldonado** es una plataforma web para la **reserva anticipada de kayaks** en Maldonado, Uruguay.  
Permite a los usuarios seleccionar tipologías de kayaks disponibles, reservar **uno o más** con al menos **24 horas de anticipación**, y definir la modalidad de retiro/entrega:

- Retiro en **puntos de encuentro predefinidos** por el arrendador.
- **Entrega a domicilio**.
- Entrega en un **punto indicado** por el arrendatario.

---

## Objetivos

- Digitalizar el proceso de alquiler y reservas.
- Mostrar tipologías, características y disponibilidad.
- Evitar sobre-reservas mediante validaciones de disponibilidad.
- Simplificar la operación del arrendador con un panel de administración.

---

## Alcance Funcional

### Usuario (Cliente)
- Navegar tipologías de kayaks disponibles.
- Seleccionar fecha (mínimo 24h de anticipación) y cantidad.
- Elegir modalidad de retiro/entrega:
  - Punto predefinido (arrendador)
  - Domicilio
  - Punto personalizado (arrendatario)
- Confirmar reserva.

### Arrendador (Administración)
- ABM de tipologías de kayaks (nombre, capacidad, precio, stock, etc.).
- Gestión de puntos de encuentro.
- Visualización/gestión de reservas (estado, fecha, logística).
- Control de stock y disponibilidad.

---

## Reglas de Negocio

- Reservas con **mínimo 24 horas** de anticipación.
- Validación de disponibilidad antes de confirmar.
- Los puntos de encuentro “predefinidos” se administran por el arrendador.
- La modalidad domicilio/punto personalizado puede requerir validaciones adicionales.

---

## Stack Tecnológico

Este proyecto se implementa como **full-stack** con:

- **Frontend/Backend:** Next.js (App Router)  
  - UI y Server Actions / Route Handlers para endpoints internos.
- **Base de Datos:** Supabase Postgres
- **Auth:** Supabase Auth (principalmente para panel admin)
- **Storage:** Supabase Storage (imágenes de kayaks, opcional)
- **Seguridad:** RLS (Row Level Security) en Supabase

---

## Arquitectura (Resumen)

- Lecturas públicas (tipologías/puntos) con `anon key` desde el cliente.
- Operaciones sensibles (crear reserva, actualizar estados, admin) a través de endpoints server-side
  en Next.js (Route Handlers) usando credenciales seguras en el servidor.

---

## Configuración de Entorno

Crear un archivo `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

SUPABASE_SERVICE_ROLE_KEY=...

---

## Scripts

Instalación:
npm install

Desarrollo:
npm run dev

Build:
npm run build

Start:
npm run start

---

## Despliegue

### Supabase
1. Crear proyecto en Supabase.
2. Crear tablas (tipologías, puntos, reservas, items).
3. Configurar RLS y políticas.
4. (Opcional) Configurar Storage para imágenes.

### Vercel
1. Importar repositorio en Vercel.
2. Configurar variables de entorno.
3. Deploy automático con cada push a main.

---

## Estado del Proyecto

En etapa de planificación / implementación inicial.

---

## Roadmap (Propuesto)

- Modelado de BD + RLS
- Catálogo de tipologías + detalle
- Flujo de reserva
- Panel admin
- Notificaciones por email (opcional)
- Pagos en línea (opcional)

---

## Licencia

A definir.
