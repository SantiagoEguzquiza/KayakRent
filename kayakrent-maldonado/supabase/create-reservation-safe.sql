-- Función segura para crear reservas (verifica stock y reservas activas en una transacción)
-- Ejecutar en Supabase SQL Editor
-- Requiere la columna expires_at en reservations (ejecutar si no existe):
-- alter table public.reservations add column if not exists expires_at timestamptz;

create or replace function create_reservation_safe(
  p_kayak_type_id uuid,
  p_reservation_date date,
  p_quantity integer,
  p_delivery_mode text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text
)
returns void
language plpgsql
as $$
declare
  v_stock integer;
  v_reserved integer;
begin
  -- obtener stock
  select stock into v_stock
  from public.kayak_types
  where id = p_kayak_type_id
  for update;

  -- contar reservas activas
  select coalesce(sum(quantity),0)
  into v_reserved
  from public.reservations
  where kayak_type_id = p_kayak_type_id
    and reservation_date = p_reservation_date
    and status <> 'cancelled'
    and (expires_at is null or expires_at > now());

  if v_stock - v_reserved < p_quantity then
    raise exception 'No hay stock disponible';
  end if;

  insert into public.reservations(
    kayak_type_id,
    reservation_date,
    quantity,
    delivery_mode,
    customer_name,
    customer_email,
    customer_phone,
    status,
    expires_at
  )
  values (
    p_kayak_type_id,
    p_reservation_date,
    p_quantity,
    p_delivery_mode,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    'pending',
    now() + interval '30 minutes'
  );
end;
$$;
