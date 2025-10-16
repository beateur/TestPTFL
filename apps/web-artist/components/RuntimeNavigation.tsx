'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styled } from '@stitches/react';
import type { RuntimeNavigationItem } from '../lib/data';

const Header = styled('header', {
  position: 'sticky',
  top: 0,
  zIndex: 20,
  backdropFilter: 'blur(18px)',
  background: 'rgba(5, 5, 15, 0.65)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
});

const HeaderInner = styled('div', {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '1.5rem clamp(1.5rem, 4vw, 3rem)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
  color: 'white'
});

const Branding = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  textDecoration: 'none',
  color: 'inherit'
});

const BrandTitle = styled('span', {
  fontSize: '1.35rem',
  fontWeight: 600
});

const BrandTagline = styled('span', {
  fontSize: '0.85rem',
  opacity: 0.7
});

const Nav = styled('nav', {
  display: 'flex'
});

const NavList = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
  margin: 0,
  padding: 0
});

const NavItem = styled('li', {});

const NavLink = styled(Link, {
  position: 'relative',
  textDecoration: 'none',
  color: 'rgba(255, 255, 255, 0.75)',
  fontWeight: 500,
  transition: 'color 0.2s ease',
  '&[data-active="true"]': {
    color: 'white'
  },
  '&::after': {
    'content': '',
    position: 'absolute',
    left: 0,
    bottom: '-0.4rem',
    width: '100%',
    height: '2px',
    background: 'var(--accent)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.2s ease'
  },
  '&[data-active="true"]::after': {
    transform: 'scaleX(1)'
  },
  '&:hover': {
    color: 'white'
  }
});

interface RuntimeNavigationProps {
  navigation: RuntimeNavigationItem[];
  accentColor: string;
  artist: { slug: string; displayName: string; tagline: string };
}

export function RuntimeNavigation({ navigation, accentColor, artist }: RuntimeNavigationProps) {
  const pathname = usePathname();
  const normalizedPath = pathname?.startsWith(`/${artist.slug}`)
    ? pathname
    : `/${artist.slug}` + (pathname ?? '');

  return (
    <Header>
      <HeaderInner>
        <Branding href={`/${artist.slug}`}>
          <BrandTitle>{artist.displayName}</BrandTitle>
          <BrandTagline>{artist.tagline}</BrandTagline>
        </Branding>
        <Nav>
          <NavList>
            {navigation.map((item) => {
              const isActive = normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`);
              return (
                <NavItem key={item.href}>
                  <NavLink href={item.href} data-active={isActive} style={{ ['--accent' as string]: accentColor }}>
                    {item.label}
                  </NavLink>
                </NavItem>
              );
            })}
          </NavList>
        </Nav>
      </HeaderInner>
    </Header>
  );
}
