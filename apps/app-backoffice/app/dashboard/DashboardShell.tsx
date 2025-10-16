'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { FiBarChart2, FiLayers, FiLogOut, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAccountContext } from './AccountProvider';
import { trackEvent } from '../../lib/telemetry';

const MotionBox = motion(Box);

export function DashboardShell() {
  const toast = useToast();
  const { overview, selectedArtist, selectArtist, canCreatePage, isLoading } = useAccountContext();

  useEffect(() => {
    if (selectedArtist?.limit.state === 'warning') {
      trackEvent('accounts.plan_limit_warning', {
        artistId: selectedArtist.id,
        metric: selectedArtist.limit.metric
      });
    }
    if (selectedArtist?.limit.state === 'blocked') {
      trackEvent('accounts.plan_limit_block', {
        artistId: selectedArtist.id,
        metric: selectedArtist.limit.metric
      });
    }
  }, [selectedArtist]);

  const accountPlan = overview?.account.plan;

  const stats = useMemo(
    () => ({
      visits: 2480,
      conversions: 54,
      pages: selectedArtist?.pageCount ?? 0
    }),
    [selectedArtist?.pageCount]
  );

  const handleCreatePage = () => {
    if (!canCreatePage && selectedArtist) {
      toast({
        status: 'warning',
        title: "Limite atteinte",
        description: selectedArtist.limit.message ?? "Votre plan actuel ne permet pas d'ajouter d'autres pages."
      });
      return;
    }
    trackEvent('dashboard.create_page_click', { artistId: selectedArtist?.id });
    toast({
      status: 'info',
      title: 'Bientôt disponible',
      description: 'La création de pages est en cours d\'implémentation dans le Page Builder.'
    });
  };

  const logout = async () => {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <Flex minH="100vh" bg="linear-gradient(180deg, #0b0418 0%, #120a2c 60%, #1b0f3d 100%)">
      <Box w={{ base: 'full', md: '72' }} borderRightWidth={{ base: 0, md: '1px' }} borderColor="whiteAlpha.200" px={6} py={8}>
        <Heading size="md" mb={10} color="white">
          Lumina Studio
        </Heading>
        <Stack spacing={4}>
          {overview?.artists.map((artist) => (
            <Button
              key={artist.id}
              variant={selectedArtist?.id === artist.id ? 'solid' : 'ghost'}
              colorScheme="purple"
              justifyContent="space-between"
              onClick={() => {
                selectArtist(artist.id);
                trackEvent('accounts.artist_switch', { artistId: artist.id });
              }}
              isLoading={isLoading}
            >
              <Flex align="center" gap={3} flex="1">
                <Text>{artist.name}</Text>
                {artist.limit.state !== 'ok' && (
                  <Badge colorScheme={artist.limit.state === 'warning' ? 'orange' : 'red'}>{artist.limit.state}</Badge>
                )}
              </Flex>
            </Button>
          ))}
        </Stack>
        <Button mt={10} variant="ghost" leftIcon={<FiLogOut />} onClick={logout} colorScheme="purple">
          Se déconnecter
        </Button>
      </Box>
      <Box flex="1" px={{ base: 6, md: 12 }} py={10}>
        <HStack justify="space-between" mb={12} align={{ base: 'flex-start', md: 'center' }} spacing={6} flexDir={{ base: 'column', md: 'row' }}>
          <Stack spacing={2}>
            <Text fontSize="sm" color="purple.200">
              Artiste sélectionné
            </Text>
            <Heading size="lg">{selectedArtist?.name ?? 'Chargement...'}</Heading>
            {accountPlan && (
              <HStack spacing={3}>
                <Badge colorScheme="purple">{accountPlan.name}</Badge>
                <Text color="gray.400">Limite pages : {accountPlan.pageLimit ?? 'Illimité'}</Text>
              </HStack>
            )}
          </Stack>
          <Tooltip
            label={!canCreatePage ? selectedArtist?.limit.message : undefined}
            isDisabled={canCreatePage}
            placement="left"
            shouldWrapChildren
          >
            <Button colorScheme="purple" onClick={handleCreatePage} isDisabled={!canCreatePage}>
              Créer une page
            </Button>
          </Tooltip>
        </HStack>

        {selectedArtist?.limit.state !== 'ok' && (
          <Alert status={selectedArtist.limit.state === 'warning' ? 'warning' : 'error'} borderRadius="lg" mb={8}>
            <AlertIcon />
            <AlertDescription>{selectedArtist.limit.message}</AlertDescription>
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={12}>
          <StatCard icon={FiBarChart2} label="Visites (7j)" value={`${stats.visits}`} trend="+18%" />
          <StatCard icon={FiUser} label="Contacts (30j)" value={`${stats.conversions}`} trend="+6%" />
          <StatCard icon={FiLayers} label="Pages publiées" value={`${stats.pages}`} trend={canCreatePage ? '+1 dispo' : 'Limite atteinte'} />
        </SimpleGrid>

        <Box mb={8}>
          <Heading size="md" mb={2}>
            Utilisation du plan
          </Heading>
          <Text color="gray.300">
            Pages publiées : {overview?.account.usage.pages ?? 0} / {accountPlan?.pageLimit ?? '∞'} — Stockage :{' '}
            {overview?.account.usage.storageMb ?? 0} Mo / {accountPlan?.storageLimitMb ?? '∞'} Mo
          </Text>
        </Box>

        <Box>
          <Tabs colorScheme="purple" variant="enclosed" isFitted>
            <TabList>
              <Tab>Vue d'ensemble</Tab>
              <Tab>Pages & sections</Tab>
              <Tab>Médias</Tab>
              <Tab>Statistiques</Tab>
            </TabList>
          </Tabs>
          <MotionBox
            mt={8}
            p={10}
            borderRadius="3xl"
            borderWidth="1px"
            borderColor="whiteAlpha.200"
            bg="rgba(15, 10, 32, 0.85)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading size="md" mb={4}>
              Aperçu des performances
            </Heading>
            <Text color="gray.300">
              Visualisez ici les indicateurs clés issus des Edge Functions Supabase pour chaque artiste. Des graphiques
              dynamiques s'afficheront automatiquement lorsque les intégrations seront actives.
            </Text>
          </MotionBox>
        </Box>
      </Box>
    </Flex>
  );
}

interface StatCardProps {
  icon: typeof FiBarChart2;
  label: string;
  value: string;
  trend: string;
}

function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <MotionBox
      p={8}
      borderRadius="3xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="rgba(17, 12, 34, 0.8)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HStack spacing={4} mb={6}>
        <Flex align="center" justify="center" w={12} h={12} borderRadius="full" bg="purple.500" color="white">
          <Icon as={icon} boxSize={6} />
        </Flex>
        <Stack spacing={0}>
          <Text color="gray.400">{label}</Text>
          <Heading size="lg">{value}</Heading>
        </Stack>
      </HStack>
      <Text color="green.300">{trend}</Text>
    </MotionBox>
  );
}

