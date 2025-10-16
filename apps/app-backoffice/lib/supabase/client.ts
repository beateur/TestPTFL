'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { useMemo, useState } from 'react';

/**
 * Hook returning a memoised Supabase browser client so components can safely
 * interact with the authenticated session context.
 */
export function useSupabaseBrowserClient(): SupabaseClient {
  const [client] = useState(() => createClientComponentClient());
  return client;
}

/**
 * Helper to memoise the initial session passed from the server layout.
 */
export function useInitialSession(session: Session | null): Session | null {
  return useMemo(() => session, [session]);
}

