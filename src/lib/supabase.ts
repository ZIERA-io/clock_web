import { createClient } from '@supabase/supabase-js';
import type { ClockConfig } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const SUPABASE_CONFIGURED = !!(url && key);

export const supabase = SUPABASE_CONFIGURED
  ? createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export async function loadConfigFromSlug(slug: string): Promise<Partial<ClockConfig> | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('links')
    .select('config')
    .eq('slug', slug)
    .maybeSingle();
  return (data?.config as Partial<ClockConfig>) ?? null;
}
