import type { SupabaseUser } from '../modules/auth/supabase-auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: SupabaseUser;
    }
  }
}

export {};

