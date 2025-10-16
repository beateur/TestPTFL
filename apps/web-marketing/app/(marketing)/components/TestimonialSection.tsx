'use client';

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { trackEvent } from '../../../lib/analytics';
import { useSectionTracking } from '../../../lib/useSectionTracking';

const MotionBox = motion(Box);

export function TestimonialSection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sectionRef = useSectionTracking('testimonial');

  const handlePlay = () => {
    trackEvent('landing.testimonial.play');
    onOpen();
  };

  return (
    <Stack spacing={12} as="section" ref={sectionRef}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={12} align="center">
        <MotionBox
          flex="1"
          bg="rgba(11, 9, 30, 0.85)"
          borderRadius="3xl"
          borderWidth="1px"
          borderColor="rgba(143, 79, 255, 0.35)"
          p={{ base: 8, md: 12 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Stack spacing={6}>
            <Badge alignSelf="flex-start" colorScheme="purple" borderRadius="full" px={4} py={1} textTransform="none">
              Témoignage vidéo
            </Badge>
            <Heading size="xl">« Lumina a doublé nos demandes de booking en 3 mois »</Heading>
            <Text color="gray.300">
              Mira, directrice artistique du label néon synthwave "Stardust", partage comment l\'équipe utilise Lumina pour
              déployer des portfolios interactifs, suivre l\'engagement en temps réel et déclencher des campagnes ciblées.
            </Text>
            <Button size="lg" colorScheme="purple" alignSelf="flex-start" onClick={handlePlay}>
              Regarder la vidéo
            </Button>
          </Stack>
        </MotionBox>
        <MotionBox
          flex="1"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          width="full"
        >
          <AspectRatio ratio={16 / 9} borderRadius="2xl" overflow="hidden" borderWidth="1px" borderColor="rgba(143,79,255,0.4)">
            <Box
              as="button"
              type="button"
              width="100%"
              height="100%"
              position="relative"
              bgImage="url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80')"
              bgSize="cover"
              bgPos="center"
              aria-label="Lire le témoignage vidéo"
              onClick={handlePlay}
            >
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-br, rgba(5,5,15,0.6), rgba(17,6,36,0.4))"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  borderRadius="full"
                  bg="whiteAlpha.200"
                  borderWidth="2px"
                  borderColor="whiteAlpha.400"
                  w={20}
                  h={20}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    borderLeft="18px solid white"
                    borderTop="12px solid transparent"
                    borderBottom="12px solid transparent"
                    ml={1}
                  />
                </Box>
              </Box>
            </Box>
          </AspectRatio>
        </MotionBox>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900">
          <ModalCloseButton />
          <ModalBody p={0}>
            <AspectRatio ratio={16 / 9}>
              <iframe
                title="Témoignage client"
                src="https://www.youtube-nocookie.com/embed/_7HkYpQv9oA?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
