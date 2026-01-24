import { createClient } from '@supabase/supabase-js'

// Creamos el cliente con las claves del .env
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// createClient → crea la conexión
// process.env... → lee el .env
// ! → le dice a TypeScript "confía, esto existe"
