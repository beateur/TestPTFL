'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useState } from 'react';

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: {
      body: {
        bg: '#05050f',
        color: 'gray.100'
      }
    }
  },
  fonts: {
    heading: 'Plus Jakarta Sans, system-ui, sans-serif',
    body: 'Plus Jakarta Sans, system-ui, sans-serif'
  },
  colors: {
    brand: {
      50: '#f5e8ff',
      500: '#8f4fff',
      700: '#4a1fbf'
    }
  }
});

export function Providers({ children }: { children: ReactNode }) {
  const memoTheme = useMemo(() => theme, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={memoTheme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
