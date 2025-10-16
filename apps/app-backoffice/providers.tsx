'use client';

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/supabase-js';
import { ReactNode, useMemo } from 'react';
import { useInitialSession, useSupabaseBrowserClient } from './lib/supabase/client';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  styles: {
    global: {
      body: {
        bg: '#05050f',
        color: 'gray.100'
      }
    }
  },
  colors: {
    brand: {
      500: '#7c3aed',
      400: '#a855f7'
    }
  }
});

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
  initialSession: Session | null;
}

export function Providers({ children, initialSession }: ProvidersProps) {
  const memoTheme = useMemo(() => theme, []);
  const supabaseClient = useSupabaseBrowserClient();
  const session = useInitialSession(initialSession);
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={memoTheme}>
          <ColorModeScript initialColorMode={memoTheme.config.initialColorMode} />
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
