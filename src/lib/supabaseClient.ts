import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example). Auth features will not work until this is fixed.'
  );
}

// Falls back to a placeholder so createClient never throws and crashes the app
// when env vars are missing — callers check isSupabaseConfigured before use.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
