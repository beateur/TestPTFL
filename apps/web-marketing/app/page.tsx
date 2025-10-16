'use client';

import { Box, Container, Stack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { FeatureHighlights } from './(marketing)/components/FeatureHighlights';
import { HeroSection } from './(marketing)/components/HeroSection';
import { AudienceSection } from './(marketing)/components/AudienceSection';
import { LeadCaptureSection } from './(marketing)/components/LeadCaptureSection';
import { PlanId, PricingSection } from './(marketing)/components/PricingSection';
import { TestimonialSection } from './(marketing)/components/TestimonialSection';

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

  const scrollToLeadCapture = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const element = document.getElementById('lead-capture');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectPlan = useCallback(
    (plan: PlanId) => {
      setSelectedPlan(plan);
      scrollToLeadCapture();
    },
    [scrollToLeadCapture]
  );

  return (
    <Box as="main" bgGradient="linear(to-b, #05050f 0%, #110624 100%)" minH="100vh" py={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Stack spacing={24}>
          <HeroSection onRequestAccess={scrollToLeadCapture} />
          <FeatureHighlights />
          <PricingSection onSelectPlan={handleSelectPlan} />
          <AudienceSection />
          <TestimonialSection />
          <LeadCaptureSection selectedPlan={selectedPlan} />
        </Stack>
      </Container>
    </Box>
  );
}
