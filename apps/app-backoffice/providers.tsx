'use client';

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';

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

export function Providers({ children }: { children: ReactNode }) {
  const memoTheme = useMemo(() => theme, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={memoTheme}>
        <ColorModeScript initialColorMode={memoTheme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
