'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AccountOverview, ArtistSummary } from '../../lib/types';
import { fetchAccountOverview } from '../../lib/api/account';

interface AccountContextValue {
  overview?: AccountOverview;
  selectedArtist?: ArtistSummary;
  selectArtist: (artistId: string) => void;
  isLoading: boolean;
  canCreatePage: boolean;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function useAccountContext(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext doit être utilisé dans AccountProvider');
  }
  return context;
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [selectedArtistId, setSelectedArtistId] = useState<string | undefined>();

  const { data, isLoading } = useQuery<AccountOverview>({
    queryKey: ['account', 'overview'],
    queryFn: fetchAccountOverview,
    staleTime: 60_000,
    retry: 1
  });

  useEffect(() => {
    if (data && !selectedArtistId) {
      setSelectedArtistId(data.artists[0]?.id);
    }
  }, [data, selectedArtistId]);

  const value = useMemo<AccountContextValue>(() => {
    const selectedArtist = data?.artists.find((artist) => artist.id === selectedArtistId);
    const canCreatePage = (selectedArtist?.limit.state ?? 'ok') !== 'blocked';
    return {
      overview: data,
      selectedArtist,
      selectArtist: setSelectedArtistId,
      isLoading,
      canCreatePage
    };
  }, [data, isLoading, selectedArtistId]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

