'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { trackEvent } from '../../../lib/analytics';
import { useSectionTracking } from '../../../lib/useSectionTracking';
import { PlanId } from './PricingSection';

interface LeadCaptureSectionProps {
  selectedPlan?: PlanId | null;
}

interface LeadFormValues {
  name: string;
  email: string;
  portfolioUrl: string;
  primaryGoal: string;
  planInterest: PlanId | '';
}

export function LeadCaptureSection({ selectedPlan }: LeadCaptureSectionProps) {
  const sectionRef = useSectionTracking('lead');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LeadFormValues>({
    defaultValues: {
      name: '',
      email: '',
      portfolioUrl: '',
      primaryGoal: '',
      planInterest: selectedPlan ?? ''
    },
    mode: 'onBlur'
  });

  useEffect(() => {
    if (selectedPlan) {
      setValue('planInterest', selectedPlan, { shouldValidate: true, shouldDirty: false });
    }
  }, [selectedPlan, setValue]);

  const mutation = useMutation({
    mutationFn: async (payload: LeadFormValues) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = 'Une erreur est survenue.';
        try {
          const errorData = (await response.json()) as { message?: string };
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (error) {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as { id: string };
    },
    onSuccess: () => {
      trackEvent('landing.lead.submit_success');
      reset({
        name: '',
        email: '',
        portfolioUrl: '',
        primaryGoal: '',
        planInterest: selectedPlan ?? ''
      });
    },
    onError: (error: unknown) => {
      trackEvent('landing.lead.submit_error', {
        message: error instanceof Error ? error.message : 'unknown'
      });
    },
    retry: 1
  });

  const onSubmit: SubmitHandler<LeadFormValues> = (values) => {
    mutation.mutate(values);
  };

  const hasSubmittedSuccessfully = mutation.isSuccess && !mutation.isPending;
  const planInterestValue = watch('planInterest');

  return (
    <Stack spacing={10} as="section" ref={sectionRef} id="lead-capture">
      <Stack spacing={4} textAlign="center">
        <Heading size="2xl">Prêt·e à rejoindre la bêta ?</Heading>
        <Text color="gray.300" maxW="2xl" mx="auto">
          Partagez vos objectifs et l\'équipe onboarding vous recontactera sous 48h avec une démo personnalisée.
        </Text>
      </Stack>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        bg="rgba(12, 9, 28, 0.9)"
        borderRadius="3xl"
        borderWidth="1px"
        borderColor="rgba(143,79,255,0.25)"
        p={{ base: 6, md: 10 }}
        maxW="3xl"
        mx="auto"
      >
        <Stack spacing={6}>
          {hasSubmittedSuccessfully ? (
            <Alert status="success" borderRadius="lg" variant="subtle">
              <AlertIcon />
              <AlertDescription>
                Merci ! Votre candidature a bien été transmise. Explorez nos portfolios publics pendant que nous préparons votre
                onboarding.
              </AlertDescription>
            </Alert>
          ) : null}

          {mutation.isError ? (
            <Alert status="error" borderRadius="lg" variant="subtle">
              <AlertIcon />
              <AlertDescription>
                {mutation.error instanceof Error ? mutation.error.message : 'Impossible d\'envoyer votre demande pour le moment.'}
              </AlertDescription>
            </Alert>
          ) : null}

          <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
            <FormControl isRequired isInvalid={Boolean(errors.name)}>
              <FormLabel>Nom complet</FormLabel>
              <Input
                placeholder="Mira Nguyen"
                {...register('name', {
                  required: 'Le nom est requis'
                })}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(errors.email)}>
              <FormLabel>Adresse e-mail</FormLabel>
              <Input
                type="email"
                placeholder="vous@label.com"
                {...register('email', {
                  required: "L'e-mail est requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Adresse e-mail invalide'
                  }
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <FormControl isRequired isInvalid={Boolean(errors.portfolioUrl)}>
            <FormLabel>Lien vers votre portfolio actuel</FormLabel>
            <Input
              placeholder="https://lumina.art/mira"
              {...register('portfolioUrl', {
                required: 'Le portfolio est requis',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Le lien doit commencer par http ou https'
                }
              })}
            />
            <FormErrorMessage>{errors.portfolioUrl?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.primaryGoal)}>
            <FormLabel>Objectif principal</FormLabel>
            <Textarea
              placeholder="Décrivez ce que Lumina doit vous aider à accomplir"
              rows={4}
              {...register('primaryGoal', {
                required: 'Merci de détailler votre objectif',
                minLength: {
                  value: 20,
                  message: 'Ajoutez quelques détails supplémentaires (20 caractères minimum)'
                }
              })}
            />
            <FormErrorMessage>{errors.primaryGoal?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.planInterest)}>
            <FormLabel>Plan qui vous intéresse</FormLabel>
            <Select
              placeholder="Sélectionnez une offre"
              {...register('planInterest', {
                required: 'Choisissez un plan pour que nous ajustions la démo'
              })}
              value={planInterestValue}
              onChange={(event) => {
                const value = event.target.value as PlanId | '';
                setValue('planInterest', value, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true
                });
              }}
            >
              <option value="freemium">Freemium — lancer une vitrine</option>
              <option value="pro">Pro — automatiser sa croissance</option>
              <option value="studio">Studio — gérer plusieurs artistes</option>
            </Select>
            <FormErrorMessage>{errors.planInterest?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            size="lg"
            colorScheme="purple"
            isLoading={mutation.isPending}
            loadingText="Envoi..."
            disabled={mutation.isPending}
          >
            Envoyer ma demande
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
