/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export function getSupabase() {
  if (!supabaseInstance) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      return null
    }

    supabaseInstance = createClient(url, anonKey)
  }
  return supabaseInstance
}
