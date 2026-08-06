/**
 * Supabase Client Integration & Fallback Handler
 */

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://quwnuohfftskciueyqeg.supabase.co';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qEtfNzOJ3u4stp_vXW34xA_6bUC_8By';

let supabase = null;

if (typeof window !== 'undefined' && window.supabase) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[Supabase] Client initialized with project URL:', SUPABASE_URL);
  } catch (e) {
    console.warn('[Supabase] Initialization fallback to mock state:', e);
  }
}

export { supabase, SUPABASE_URL, SUPABASE_KEY };
