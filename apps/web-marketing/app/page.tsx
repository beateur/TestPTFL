'use client';

import { Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const features = [
  {
    title: 'Builder no-code intuitif',
    description:
      'Composez des pages immersives avec des sections animées, des grilles et des vidéos en quelques minutes.'
  },
  {
    title: 'Statistiques en temps réel',
    description: 'Visualisez les visites, conversions et sources de trafic de vos portfolios en un clin d\'œil.'
  },
  {
    title: 'Multi-artistes',
    description: 'Gérez plusieurs identités créatives depuis un même compte et basculez instantanément.'
  }
];

export default function Page() {
  return (
    <Box as="main" bgGradient="linear(to-b, #05050f 0%, #110624 100%)" minH="100vh" py={24}>
      <Container maxW="6xl">
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={16}>
          <Stack spacing={8} maxW="lg">
            <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Heading as="h1" size="3xl" bgGradient="linear(to-r, brand.500, cyan.300)" bgClip="text">
                Le portfolio que votre art mérite
              </Heading>
            </MotionBox>
            <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <Text fontSize="xl" color="gray.300">
                Lumina est une plateforme SaaS tout-en-un pour concevoir des portfolios artistiques, analyser les
                performances et dialoguer avec vos fans.
              </Text>
            </MotionBox>
            <MotionBox initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <Button size="lg" colorScheme="purple" width={{ base: 'full', md: 'fit-content' }}>
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

        <Stack spacing={16} mt={24}>
          <MotionBox initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Heading size="xl">Fonctionnalités clés</Heading>
          </MotionBox>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {features.map((feature) => (
              <MotionBox
                key={feature.title}
                bg="rgba(17, 13, 36, 0.8)"
                p={8}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="rgba(143, 79, 255, 0.2)"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Heading size="md" mb={3}>
                  {feature.title}
                </Heading>
                <Text color="gray.300">{feature.description}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
