'use client';

import { motion } from 'framer-motion';
import { styled } from '@stitches/react';
import type { SectionDefinition, ThemeTokens } from '../lib/data';

const Wrapper = styled('section', {
  padding: '4rem clamp(2rem, 6vw, 8rem)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
});

const Title = styled(motion.h2, {
  fontSize: 'clamp(2.6rem, 5vw, 3.5rem)',
  margin: 0
});

const Paragraph = styled(motion.p, {
  fontSize: '1.2rem',
  maxWidth: '60ch',
  lineHeight: 1.7,
  color: 'rgba(255, 255, 255, 0.75)'
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

interface SectionRendererProps {
  sections: SectionDefinition[];
  theme: ThemeTokens;
}

export function SectionRenderer({ sections, theme }: SectionRendererProps) {
  return (
    <div style={{ background: theme.background, color: theme.text }}>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <Title initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  {section.title}
                </Title>
                <Paragraph initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                  {section.description}
                </Paragraph>
              </Wrapper>
            );
          case 'gallery':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <Paragraph
                  as={motion.p}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Cette galerie présentera {section.artworks.length} œuvres sélectionnées.
                </Paragraph>
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
                  “{section.content}”
                </Title>
                <Paragraph as={motion.cite} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
                  {section.author}
                </Paragraph>
              </Wrapper>
            );
          case 'cta':
            return (
              <Wrapper key={`${section.type}-${index}`}>
                <Title initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  {section.title}
                </Title>
                <CallToAction
                  href={section.href}
                  style={{ ['--accent' as string]: theme.accent }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {section.buttonLabel}
                </CallToAction>
              </Wrapper>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
