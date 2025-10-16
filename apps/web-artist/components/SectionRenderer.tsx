'use client';

import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@stitches/react';
import type { RuntimeSection, RuntimeTheme } from '../lib/data';
import { HeroSection } from './HeroSection';
import { GallerySection } from './GallerySection';
import { getRuntimeApiBaseUrl } from '../lib/config';
import { emitRuntimeEvent } from '../lib/analytics';

const Wrapper = styled('section', {
  padding: '4rem clamp(2rem, 6vw, 8rem)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem'
});

const Title = styled(motion.h2, {
  fontSize: 'clamp(2.6rem, 5vw, 3.5rem)',
  margin: 0,
  lineHeight: 1.1
});

const Paragraph = styled(motion.p, {
  fontSize: '1.1rem',
  maxWidth: '60ch',
  lineHeight: 1.7,
  color: 'rgba(255, 255, 255, 0.78)'
});

const CallToAction = styled(motion.a, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem 2rem',
  borderRadius: '999px',
  fontWeight: 600,
  textDecoration: 'none',
  color: '#05050f',
  background: 'var(--accent)',
  width: 'fit-content'
});

const StatsGrid = styled('div', {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
});

const StatCard = styled(motion.div, {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '1.25rem',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
});

const TestimonialsGrid = styled('div', {
  display: 'grid',
  gap: '1.75rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
});

const TestimonialCard = styled(motion.blockquote, {
  margin: 0,
  padding: '2rem',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
});

const ContactForm = styled('form', {
  display: 'grid',
  gap: '1.25rem',
  width: '100%',
  maxWidth: '520px'
});

const Input = styled('input', {
  padding: '0.85rem 1.1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(5, 5, 15, 0.35)',
  color: 'inherit',
  fontSize: '1rem'
});

const Textarea = styled('textarea', {
  padding: '0.85rem 1.1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(5, 5, 15, 0.35)',
  color: 'inherit',
  fontSize: '1rem',
  minHeight: '140px',
  resize: 'vertical'
});

const SubmitButton = styled('button', {
  padding: '0.95rem 2rem',
  borderRadius: '999px',
  border: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  color: '#05050f',
  background: 'var(--accent)',
  transition: 'transform 0.2s ease',
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  '&:hover:not(:disabled)': {
    transform: 'translateY(-2px)'
  }
});

const ContactMessage = styled('p', {
  margin: 0,
  fontSize: '0.95rem',
  maxWidth: '40ch'
});

type ContactState = 'idle' | 'submitting' | 'success' | 'error' | 'blocked';

interface ContactSectionProps {
  title: string;
  description?: string;
  accent: string;
  artistId: string;
  artistName: string;
  contactEnabled: boolean;
}

function ContactSection({ title, description, accent, artistId, artistName, contactEnabled }: ContactSectionProps) {
  const [state, setState] = useState<ContactState>('idle');
  const [error, setError] = useState<string | null>(null);

  const heading = useMemo(() => title ?? `Contacter ${artistName}`, [title, artistName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contactEnabled) {
      setState('blocked');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      artistId,
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? '')
    };

    setState('submitting');
    setError(null);

    try {
      const response = await fetch(`${getRuntimeApiBaseUrl()}/runtime/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('request_failed');
      }

      setState('success');
      emitRuntimeEvent('runtime.contact_submit', { artistId });
    } catch (err) {
      setState('error');
      setError("Une erreur est survenue lors de l’envoi. Veuillez réessayer.");
    }
  };

  if (!contactEnabled) {
    return (
      <Wrapper>
        <Title initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {heading}
        </Title>
        <ContactMessage>
          Cette fonctionnalité est disponible avec un plan Professionnel. Contactez l’équipe support pour activer le formulaire.
        </ContactMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {heading}
      </Title>
      {description ? (
        <Paragraph initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {description}
        </Paragraph>
      ) : null}
      <ContactForm onSubmit={handleSubmit}>
        <Input name="name" placeholder="Votre nom" aria-label="Votre nom" required />
        <Input name="email" type="email" placeholder="Adresse email" aria-label="Adresse email" required />
        <Textarea name="message" placeholder="Décrivez votre projet" aria-label="Message" required />
        <SubmitButton type="submit" disabled={state === 'submitting'} style={{ ['--accent' as string]: accent }}>
          {state === 'submitting' ? 'Envoi en cours…' : 'Envoyer le message'}
        </SubmitButton>
        {state === 'success' ? (
          <ContactMessage role="status">Merci ! Nous reviendrons vers vous sous 48 heures.</ContactMessage>
        ) : null}
        {state === 'error' && error ? (
          <ContactMessage role="alert" style={{ color: '#fecaca' }}>
            {error}
          </ContactMessage>
        ) : null}
      </ContactForm>
    </Wrapper>
  );
}

interface SectionRendererProps {
  sections: RuntimeSection[];
  theme: RuntimeTheme;
  accentColor: string;
  contactEnabled: boolean;
  artist: { id: string; name: string };
}

export function SectionRenderer({ sections, theme, accentColor, contactEnabled, artist }: SectionRendererProps) {
  return (
    <div style={{ background: theme.background, color: theme.text }}>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={`${section.type}-${index}`}
                data={section.data}
                background={theme.background}
                accent={accentColor}
              />
            );
          case 'gallery':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <GallerySection artworks={section.data.artworks} />
              </Wrapper>
            );
          case 'quote':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <Title
                  as={motion.blockquote}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{ fontStyle: 'italic' }}
                >
                  “{section.data.content}”
                </Title>
                <Paragraph as={motion.cite} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
                  {section.data.author}
                </Paragraph>
              </Wrapper>
            );
          case 'cta':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <Title initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  {section.data.title}
                </Title>
                {section.data.description ? (
                  <Paragraph initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                    {section.data.description}
                  </Paragraph>
                ) : null}
                <CallToAction
                  href={section.data.href}
                  style={{ ['--accent' as string]: accentColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {section.data.buttonLabel}
                </CallToAction>
              </Wrapper>
            );
          case 'stats':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <StatsGrid>
                  {section.data.items.map((item: any, statIndex: number) => (
                    <StatCard
                      key={`${item.label}-${statIndex}`}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: statIndex * 0.1 }}
                    >
                      <motion.span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{item.value}</motion.span>
                      <motion.span style={{ fontSize: '1rem', letterSpacing: '0.02em', opacity: 0.8 }}>{item.label}</motion.span>
                      {item.helper ? (
                        <motion.span style={{ fontSize: '0.9rem', opacity: 0.6 }}>{item.helper}</motion.span>
                      ) : null}
                    </StatCard>
                  ))}
                </StatsGrid>
              </Wrapper>
            );
          case 'testimonials':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <TestimonialsGrid>
                  {section.data.items.map((item: any, testimonialIndex: number) => (
                    <TestimonialCard
                      key={`${item.name}-${testimonialIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: testimonialIndex * 0.1 }}
                    >
                      <Paragraph as={motion.p} style={{ fontSize: '1.1rem', color: 'inherit' }}>
                        “{item.quote}”
                      </Paragraph>
                      <motion.cite style={{ fontStyle: 'normal', fontWeight: 600 }}>
                        {item.name}
                        {item.role ? <span style={{ opacity: 0.7, marginLeft: '0.35rem' }}>— {item.role}</span> : null}
                      </motion.cite>
                    </TestimonialCard>
                  ))}
                </TestimonialsGrid>
              </Wrapper>
            );
          case 'contact':
            return (
              <ContactSection
                key={`${section.type}-${index}`}
                title={section.data.title}
                description={section.data.description}
                accent={accentColor}
                artistId={artist.id}
                artistName={artist.name}
                contactEnabled={contactEnabled}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
