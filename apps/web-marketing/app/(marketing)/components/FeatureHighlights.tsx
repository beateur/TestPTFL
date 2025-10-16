'use client';

import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

import { useSectionTracking } from '../../../lib/useSectionTracking';

const features = [
  {
    title: 'Builder no-code intuitif',
    description: 'Composez des pages immersives avec des sections animées, des grilles et des vidéos en quelques minutes.'
  },
  {
    title: 'Statistiques en temps réel',
    description: "Visualisez les visites, conversions et sources de trafic de vos portfolios en un clin d'œil."
  },
  {
    title: 'Multi-artistes',
    description: 'Gérez plusieurs identités créatives depuis un même compte et basculez instantanément.'
  }
];

export function FeatureHighlights() {
  const sectionRef = useSectionTracking('features');

  return (
    <Stack spacing={16} as="section" ref={sectionRef}>
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
  );
}
