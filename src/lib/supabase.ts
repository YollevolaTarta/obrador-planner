import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yseuxchiumkwbcovkowu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TvhNT43XHLTBUnOseurgDw_x3etAPRy";

let client: SupabaseClient | null = null;

/** Cliente Supabase solo para el navegador (sesión persistente). */
export function sb(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("El cliente de la base solo se usa en el navegador");
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage },
    });
  }
  return client;
}
