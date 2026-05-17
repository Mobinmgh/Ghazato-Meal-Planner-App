import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null;

export function getSupabaseAdmin() {
  if (!supabaseInstance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing - some features will fail");
      return null;
    }
    
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}
