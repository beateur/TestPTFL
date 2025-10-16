'use client';

import { Box, Button, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { useSectionTracking } from '../../../lib/useSectionTracking';

const MotionBox = motion(Box);

interface HeroSectionProps {
  onRequestAccess: () => void;
}

export function HeroSection({ onRequestAccess }: HeroSectionProps) {
  const sectionRef = useSectionTracking('hero');

  return (
    <Flex
      as="section"
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify="space-between"
      gap={16}
      ref={sectionRef}
    >
      <Stack spacing={8} maxW="lg">
        <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Heading as="h1" size="3xl" bgGradient="linear(to-r, brand.500, cyan.300)" bgClip="text">
            Le portfolio que votre art mérite
          </Heading>
        </MotionBox>
        <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <Text fontSize="xl" color="gray.300">
            Lumina est une plateforme SaaS tout-en-un pour concevoir des portfolios artistiques, analyser les performances et
            dialoguer avec vos fans.
          </Text>
        </MotionBox>
        <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Button
            size="lg"
            colorScheme="purple"
            width={{ base: 'full', md: 'fit-content' }}
            onClick={onRequestAccess}
          >
            Demander un accès
          </Button>
        </MotionBox>
      </Stack>
      <MotionBox
        flex="1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        bg="rgba(255,255,255,0.03)"
        borderRadius="3xl"
        borderWidth="1px"
        borderColor="rgba(143,79,255,0.4)"
        p={10}
      >
        <Stack spacing={4}>
          <Text fontSize="lg" color="gray.400" textTransform="uppercase" letterSpacing="widest">
            Statistiques en direct
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
            <Stack>
              <Text fontSize="4xl" fontWeight="bold" color="white">
                1 248
              </Text>
              <Text color="gray.400">Portfolios actifs</Text>
            </Stack>
            <Stack>
              <Text fontSize="4xl" fontWeight="bold" color="white">
                87 k
              </Text>
              <Text color="gray.400">Visiteurs mensuels</Text>
            </Stack>
          </SimpleGrid>
        </Stack>
      </MotionBox>
    </Flex>
  );
}
