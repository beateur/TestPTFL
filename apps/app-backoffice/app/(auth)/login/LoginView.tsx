'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { trackEvent } from '../../../lib/telemetry';
import { useSupabaseBrowserClient } from '../../../lib/supabase/client';

export function LoginView() {
  const supabase = useSupabaseBrowserClient();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMagicLink = async () => {
    setIsSubmitting(true);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });

    if (error) {
      trackEvent('auth.login_failure', { strategy: 'magic_link', reason: error.message });
      toast({
        status: 'error',
        title: 'Connexion impossible',
        description: error.message
      });
    } else {
      trackEvent('auth.login_success', { strategy: 'magic_link' });
      toast({
        status: 'success',
        title: 'Email envoyé',
        description: 'Consultez votre boîte mail pour finaliser la connexion.'
      });
    }

    setIsSubmitting(false);
  };

  const handleOAuth = async (provider: 'google') => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      trackEvent('auth.login_failure', { strategy: provider, reason: error.message });
      toast({
        status: 'error',
        title: 'Connexion impossible',
        description: error.message
      });
    } else {
      trackEvent('auth.login_success', { strategy: provider });
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#05050f">
      <Box
        maxW="lg"
        w="full"
        bg="rgba(15, 10, 32, 0.85)"
        borderRadius="3xl"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        p={{ base: 8, md: 12 }}
      >
        <Stack spacing={6} textAlign="left">
          <Heading size="lg">Connexion à Lumina Studio</Heading>
          <Text color="gray.300">
            Accédez à votre espace de gestion d'artistes en vous connectant via un lien magique ou votre compte Google.
          </Text>
          <FormControl>
            <FormLabel>Email professionnel</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@label.com"
              bg="whiteAlpha.50"
              borderColor="whiteAlpha.200"
            />
          </FormControl>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button
              colorScheme="purple"
              onClick={handleMagicLink}
              isLoading={isSubmitting}
              isDisabled={!email}
              flex="1"
            >
              Recevoir un lien magique
            </Button>
            <Button variant="outline" colorScheme="purple" onClick={() => handleOAuth('google')} flex="1">
              Continuer avec Google
            </Button>
          </Stack>
          <Text fontSize="sm" color="gray.400">
            En vous connectant, vous acceptez la charte d'utilisation et les limites associées à votre abonnement.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}

