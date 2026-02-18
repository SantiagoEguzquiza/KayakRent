-- Función que BORRA las reservas expiradas (en vez de marcarlas como cancelled)
-- Ejecutar en Supabase SQL Editor

create or replace function cancel_expired_reservations()
returns void
language plpgsql
as $$
begin
  delete from public.reservations
  where status = 'pending'
    and expires_at is not null
    and expires_at < now();
end;
$$;
