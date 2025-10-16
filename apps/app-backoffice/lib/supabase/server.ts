import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createSupabaseServerClient(): SupabaseClient {
  return createServerComponentClient({ cookies });
}

export function createSupabaseRouteHandlerClient(): SupabaseClient {
  return createRouteHandlerClient({ cookies });
}

