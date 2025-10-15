'use client';

import { motion } from 'framer-motion';
import { styled } from '@stitches/react';
import type { ArtistConfig } from '../lib/data';

const Wrapper = styled('section', {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '6rem clamp(2rem, 6vw, 10rem)',
  gap: '1.5rem',
  background: 'var(--hero-background)'
});

const Title = styled(motion.h1, {
  fontSize: 'clamp(3rem, 6vw, 6rem)',
  margin: 0,
  fontWeight: 600,
  letterSpacing: '-0.04em'
});

const Tagline = styled(motion.p, {
  fontSize: 'clamp(1.2rem, 2.6vw, 1.8rem)',
  maxWidth: '45ch',
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.75)'
});

const AccentBar = styled(motion.div, {
  width: '120px',
  height: '4px',
  background: 'var(--hero-accent)',
  borderRadius: '999px'
});

interface HeroSectionProps {
  artist: ArtistConfig;
}

export function HeroSection({ artist }: HeroSectionProps) {
  return (
    <Wrapper style={{ ['--hero-background' as string]: artist.theme.background, ['--hero-accent' as string]: artist.theme.accent }}>
      <AccentBar initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
      <Title initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        {artist.name}
      </Title>
      <Tagline initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        {artist.tagline}
      </Tagline>
    </Wrapper>
  );
}
