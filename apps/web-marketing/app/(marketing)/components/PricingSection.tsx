'use client';

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@chakra-ui/icons';

import { trackEvent } from '../../../lib/analytics';
import { useSectionTracking } from '../../../lib/useSectionTracking';

export type PlanId = 'freemium' | 'pro' | 'studio';

interface PricingSectionProps {
  onSelectPlan: (plan: PlanId) => void;
}

const MotionBox = motion(Box);

const pricingTiers: Array<{
  id: PlanId;
  name: string;
  price: string;
  description: string;
  popular?: boolean;
  cta: string;
  features: string[];
}> = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: '0€',
    description: 'Démarrez gratuitement et publiez votre première vitrine digitale.',
    cta: 'Créer mon compte',
    features: ['Portfolio unique', 'Thèmes lumineux', 'Statistiques essentielles']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29€',
    description: 'Pour les artistes en croissance qui veulent automatiser leur présence en ligne.',
    popular: true,
    cta: "Essayer Pro",
    features: ['Portfolios illimités', 'Automatisations sociales', 'Analyse de conversion avancée']
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '79€',
    description: 'Pensé pour les labels et agences multi-artistes avec gouvernance avancée.',
    cta: 'Contacter les ventes',
    features: ['Accès multi-équipe', 'Permissions granulaires', 'Support prioritaire & SLA']
  }
];

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const sectionRef = useSectionTracking('pricing');

  const handleCtaClick = (plan: PlanId) => {
    trackEvent('landing.pricing.cta_click', { plan });
    onSelectPlan(plan);
  };

  return (
    <Stack spacing={12} as="section" ref={sectionRef}>
      <Stack spacing={4} textAlign="center">
        <Heading size="2xl">Tarifs adaptés à chaque trajectoire</Heading>
        <Text color="gray.300" maxW="3xl" mx="auto">
          Comparez les fonctionnalités et sélectionnez l\'offre qui correspond à votre ambition artistique. Les plans sont
          évolutifs et vous pouvez changer à tout moment.
        </Text>
      </Stack>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8} justify="center">
        {pricingTiers.map((tier) => (
          <MotionBox
            key={tier.id}
            flex="1"
            maxW={{ base: 'full', lg: 'sm' }}
            bg="rgba(13, 11, 26, 0.9)"
            borderRadius="3xl"
            borderWidth="1px"
            borderColor={tier.popular ? 'brand.500' : 'rgba(143, 79, 255, 0.2)'}
            p={8}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={6} height="full">
              <Stack spacing={3}>
                <Flex align="center" justify="space-between">
                  <Heading size="lg">{tier.name}</Heading>
                  {tier.popular ? (
                    <Badge colorScheme="purple" borderRadius="full" px={3} py={1} textTransform="none">
                      Le plus choisi
                    </Badge>
                  ) : null}
                </Flex>
                <Text fontSize="4xl" fontWeight="bold" color="white">
                  {tier.price}
                  <Text as="span" fontSize="lg" color="gray.400" ml={2}>
                    / mois
                  </Text>
                </Text>
                <Text color="gray.300">{tier.description}</Text>
              </Stack>
              <List spacing={3}>
                {tier.features.map((feature) => (
                  <ListItem key={feature} display="flex" alignItems="center">
                    <ListIcon as={CheckIcon} color="brand.500" />
                    <Text color="gray.200">{feature}</Text>
                  </ListItem>
                ))}
              </List>
              <Button
                colorScheme={tier.popular ? 'purple' : 'whiteAlpha'}
                variant={tier.popular ? 'solid' : 'outline'}
                size="lg"
                mt="auto"
                onClick={() => handleCtaClick(tier.id)}
              >
                {tier.cta}
              </Button>
            </Stack>
          </MotionBox>
        ))}
      </Flex>
    </Stack>
  );
}
