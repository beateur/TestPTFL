'use client';

import { Box, Button, Flex, Heading, HStack, Icon, SimpleGrid, Stack, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { create } from 'zustand';
import { FiBarChart2, FiLayers, FiUser } from 'react-icons/fi';

const MotionBox = motion(Box);

interface DashboardState {
  currentArtist: string;
  setArtist: (artist: string) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  currentArtist: 'atelier-nova',
  setArtist: (artist) => set({ currentArtist: artist })
}));

const artists = [
  { id: 'atelier-nova', name: 'Atelier Nova' },
  { id: 'lune-onirique', name: 'Lune Onirique' },
  { id: 'studio-iris', name: 'Studio Iris' }
];

export default function DashboardPage() {
  const { currentArtist, setArtist } = useDashboardStore();
  const stats = useMemo(
    () => ({
      visits: 2480,
      avgDuration: '3 min 42',
      conversions: 54
    }),
    []
  );

  return (
    <Flex minH="100vh" bg="linear-gradient(180deg, #0b0418 0%, #120a2c 60%, #1b0f3d 100%)">
      <Box w="72" borderRightWidth="1px" borderColor="whiteAlpha.200" px={6} py={8}>
        <Heading size="md" mb={10} color="white">
          Lumina Studio
        </Heading>
        <Stack spacing={4}>
          {artists.map((artist) => (
            <Button
              key={artist.id}
              variant={currentArtist === artist.id ? 'solid' : 'ghost'}
              colorScheme="purple"
              justifyContent="flex-start"
              onClick={() => setArtist(artist.id)}
            >
              {artist.name}
            </Button>
          ))}
        </Stack>
      </Box>
      <Box flex="1" px={12} py={10}>
        <HStack justify="space-between" mb={12}>
          <Stack spacing={2}>
            <Text fontSize="sm" color="purple.200">
              Artiste sélectionné
            </Text>
            <Heading size="lg">{artists.find((artist) => artist.id === currentArtist)?.name}</Heading>
          </Stack>
          <Button colorScheme="purple">Créer une page</Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <StatCard icon={FiBarChart2} label="Visites (7j)" value={`${stats.visits}`} trend="+18%" />
          <StatCard icon={FiUser} label="Contacts (30j)" value={`${stats.conversions}`} trend="+6%" />
          <StatCard icon={FiLayers} label="Pages publiées" value="8" trend="Stable" />
        </SimpleGrid>

        <Box mt={12}>
          <Tabs colorScheme="purple" variant="enclosed" isFitted>
            <TabList>
              <Tab>Vue d\'ensemble</Tab>
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
              Intégrez ici les graphiques dynamiques alimentés par Supabase Edge Functions et visualisez les KPIs clés
              pour chaque artiste.
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
