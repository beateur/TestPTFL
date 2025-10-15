export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface ApiConfig {
  baseUrl: string;
}

export interface AppConfig {
  supabase: SupabaseConfig;
  api: ApiConfig;
}

export const defaultConfig: AppConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key'
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'
  }
};
