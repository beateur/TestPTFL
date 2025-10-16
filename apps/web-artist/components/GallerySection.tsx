'use client';

import { motion } from 'framer-motion';
import { styled } from '@stitches/react';
interface GalleryArtwork {
  title: string;
  image?: string;
}

const Section = styled('section', {
  padding: '4rem clamp(2rem, 6vw, 8rem)',
  background: 'rgba(8, 6, 20, 0.85)'
});

const Grid = styled('div', {
  display: 'grid',
  gap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
});

const Card = styled(motion.figure, {
  margin: 0,
  borderRadius: '1.5rem',
  overflow: 'hidden',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  minHeight: '260px'
});

const Caption = styled('figcaption', {
  position: 'absolute',
  inset: 'auto 0 0 0',
  padding: '1.5rem',
  background: 'linear-gradient(180deg, transparent 0%, rgba(5, 5, 15, 0.9) 100%)',
  color: 'white',
  fontWeight: 500
});

interface GallerySectionProps {
  artworks: GalleryArtwork[];
}

export function GallerySection({ artworks }: GallerySectionProps) {
  return (
    <Section>
      <Grid>
        {artworks.map((artwork, index) => (
          <Card
            key={artwork.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {artwork.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artwork.image}
                alt={artwork.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Visuel {index + 1}</span>
              </div>
            )}
            <Caption>{artwork.title}</Caption>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}
