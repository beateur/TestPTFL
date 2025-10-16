'use client';

import { Box, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiTrendingUp } from 'react-icons/fi';

import { useSectionTracking } from '../../../lib/useSectionTracking';

const MotionBox = motion(Box);

const audiences = [
  {
    icon: FiTarget,
    title: 'Artiste indépendant',
    description: 'Déployez une présence professionnelle sans développeur et pilotez votre stratégie en solo.'
  },
  {
    icon: FiUsers,
    title: 'Label & management',
    description: 'Coordonnez plusieurs talents, synchronisez leurs assets et harmonisez leur image en quelques clics.'
  },
  {
    icon: FiTrendingUp,
    title: 'Agence créative',
    description: 'Proposez des expériences immersives à vos clients et accélérez vos cycles de production.'
  }
];

export function AudienceSection() {
  const sectionRef = useSectionTracking('audience');

  return (
    <Stack spacing={12} as="section" ref={sectionRef}>
      <Stack spacing={4} textAlign="center">
        <Heading size="2xl">Pensé pour chaque audience clé</Heading>
        <Text color="gray.300" maxW="2xl" mx="auto">
          Que vous soyez un artiste émergent ou une structure établie, Lumina adapte ses flux et ses permissions à votre
          organisation.
        </Text>
      </Stack>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {audiences.map((audience) => (
          <MotionBox
            key={audience.title}
            p={8}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="rgba(143, 79, 255, 0.25)"
            bg="rgba(15, 10, 30, 0.85)"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={4}>
              <Icon as={audience.icon} boxSize={10} color="brand.500" />
              <Heading size="md">{audience.title}</Heading>
              <Text color="gray.300">{audience.description}</Text>
            </Stack>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
