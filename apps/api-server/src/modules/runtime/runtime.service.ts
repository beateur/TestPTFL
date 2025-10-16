import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { PlansService } from '../plans/plans.service';
import { PageStatusDto } from '../pages/pages.dto';
import { findFixtureArtistByHost, findFixtureArtistByIdOrSlug, runtimeFixtures } from './runtime.fixtures';
import { RuntimeContactDto, RuntimeEventDto } from './runtime.dto';

interface RuntimeResolution {
  artist: {
    id: string;
    slug: string;
    displayName: string;
    tagline: string;
    planId: string;
    theme: {
      background: string;
      accent: string;
      text: string;
    };
    accentColor: string;
    seoDescription?: string;
  };
  navigation: { label: string; slug: string[]; href: string }[];
  plan: ReturnType<PlansService['findById']>;
  pages: {
    id: string;
    title: string;
    slug: string[];
    updatedAt: string;
  }[];
  revalidateSeconds: number;
}

@Injectable()
export class RuntimeService {
  private readonly logger = new Logger('RuntimeService');

  constructor(private readonly prisma: PrismaService, private readonly plansService: PlansService) {}

  async resolveHost(host: string): Promise<RuntimeResolution> {
    const normalizedHost = host.replace(/:\\d+$/, '').toLowerCase();
    const record = await this.resolveFromDatabase(normalizedHost);

    if (!record) {
      const fallback = findFixtureArtistByHost(normalizedHost);
      if (!fallback) {
        throw new NotFoundException(`Aucun artiste associé à ${host}`);
      }

      const plan = this.plansService.findById(fallback.planId);
      return {
        artist: {
          id: fallback.id,
          slug: fallback.slug,
          displayName: fallback.displayName,
          tagline: fallback.tagline,
          planId: fallback.planId,
          theme: fallback.theme,
          accentColor: fallback.accentColor,
          seoDescription: fallback.seoDescription
        },
        navigation: fallback.navigation.map((item) => ({
          label: item.label,
          slug: item.slug,
          href: `/${[fallback.slug, ...item.slug].filter(Boolean).join('/')}`
        })),
        plan,
        pages: fallback.pages
          .filter((page) => page.status === PageStatusDto.Published)
          .map((page) => ({ id: page.id, title: page.title, slug: page.slug, updatedAt: page.updatedAt })),
        revalidateSeconds: 60
      };
    }

    const plan = this.plansService.findById(record.planId);
    return {
      artist: {
        id: record.id,
        slug: record.slug,
        displayName: record.displayName,
        tagline: record.tagline,
        planId: record.planId,
        theme: record.theme,
        accentColor: record.accentColor,
        seoDescription: record.seoDescription
      },
      navigation: record.navigation,
      plan,
      pages: record.pages,
      revalidateSeconds: 60
    };
  }

  async submitContactRequest(payload: RuntimeContactDto) {
    const plan = this.getPlanForArtist(payload.artistId);
    if (!plan.contactEnabled) {
      throw new ForbiddenException("Le plan actuel ne permet pas de contacter l'artiste");
    }

    this.logger.log(`Contact request queued for artist ${payload.artistId}`);
    return {
      status: 'queued',
      message: 'Votre message a bien été transmis à l’équipe de l’artiste.'
    };
  }

  recordEvent(event: RuntimeEventDto) {
    this.logger.debug(`Runtime event: ${event.event}`, event.payload ?? {});
    return { status: 'recorded' };
  }

  getPublishedPages(artistId: string) {
    const artist = findFixtureArtistByIdOrSlug(artistId);
    if (!artist) {
      throw new NotFoundException('Artiste introuvable');
    }

    return artist.pages.filter((page) => page.status === PageStatusDto.Published);
  }

  private getPlanForArtist(artistId: string) {
    const artist = findFixtureArtistByIdOrSlug(artistId);
    if (!artist) {
      throw new NotFoundException('Artiste introuvable');
    }

    return this.plansService.findById(artist.planId);
  }

  private async resolveFromDatabase(host: string) {
    const prismaClient = (this.prisma as unknown as any)?.artists;
    if (!prismaClient?.findFirst) {
      return null;
    }

    try {
      const artist = await prismaClient.findFirst({
        where: {
          OR: [
            { custom_domain: host },
            { subdomain: host.split('.')[0] },
            { slug: host.split('.')[0] }
          ]
        },
        include: {
          pages: {
            where: { is_hidden: false },
            orderBy: { order_index: 'asc' }
          }
        }
      });

      if (!artist) {
        return null;
      }

      return {
        id: artist.id,
        slug: artist.slug,
        displayName: artist.display_name ?? artist.name ?? artist.slug,
        tagline: artist.tagline ?? artist.bio ?? '',
        planId: artist.plan_id ?? 'freemium',
        theme: artist.theme ?? runtimeFixtures.artists[0].theme,
        accentColor: artist.accent_color ?? runtimeFixtures.artists[0].accentColor,
        seoDescription: artist.seo_description ?? undefined,
        navigation: (artist.navigation ?? []).map((item: any) => ({
          label: item.label,
          slug: item.slug ?? [],
          href: item.href ?? `/${[artist.slug, ...(item.slug ?? [])].join('/')}`
        })),
        pages: (artist.pages ?? [])
          .filter((page: any) => page.is_hidden === false)
          .map((page: any) => ({
            id: page.id,
            title: page.title,
            slug: [artist.slug, page.slug].filter(Boolean),
            updatedAt: page.updated_at ?? new Date().toISOString()
          }))
      };
    } catch (error) {
      this.logger.warn(`Impossible de résoudre ${host} via la base`, error as Error);
      return null;
    }
  }
}
