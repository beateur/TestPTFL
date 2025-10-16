import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { PageStatusDto, PatchPageDto, SectionDto, UpsertPageDto } from './pages.dto';
import { findFixtureArtistByIdOrSlug } from '../runtime/runtime.fixtures';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listByArtist(
    artistId: string,
    options: { status?: PageStatusDto; includeSections?: boolean } = {}
  ) {
    const { status, includeSections } = options;
    const prismaClient = (this.prisma as unknown as any)?.pages;

    if (prismaClient?.findMany) {
      try {
        return await prismaClient.findMany({
          where: {
            artist_id: artistId,
            ...(status
              ? {
                  is_hidden: status === PageStatusDto.Draft
                }
              : {})
          },
          orderBy: { order_index: 'asc' },
          include: includeSections
            ? { sections: { orderBy: { order_index: 'asc' } } }
            : undefined
        });
      } catch (error) {
        // fall back to fixtures
      }
    }

    const artist = findFixtureArtistByIdOrSlug(artistId);
    if (!artist) {
      return [];
    }

    return artist.pages
      .filter((page) => (status ? page.status === status : true))
      .map((page) => this.mapFixturePage(artist.id, page, includeSections));
  }

  async findOne(artistId: string, pageId: string) {
    const prismaClient = (this.prisma as unknown as any)?.pages;
    if (prismaClient?.findFirst) {
      try {
        const page = await prismaClient.findFirst({
          where: { id: pageId, artist_id: artistId },
          include: { sections: { orderBy: { order_index: 'asc' } } }
        });

        if (page) {
          return page;
        }
      } catch (error) {
        // continue to fallback
      }
    }

    const artist = findFixtureArtistByIdOrSlug(artistId);
    const fallback = artist?.pages.find((item) => item.id === pageId);

    if (!artist || !fallback) {
      throw new NotFoundException('Page not found');
    }

    return this.mapFixturePage(artist.id, fallback, true);
  }

  create(artistId: string, payload: UpsertPageDto) {
    const data: Record<string, unknown> = {
      artist_id: artistId,
      title: payload.title,
      slug: payload.slug,
      is_hidden: this.resolveVisibility(payload),
      sections: {
        create: payload.sections.map((section, index) => ({
          type: section.type,
          data: section.data ?? {},
          order_index: index,
          is_visible: section.isVisible ?? true
        }))
      }
    };

    if (payload.seoDescription !== undefined) {
      data.seo_description = payload.seoDescription;
    }

    return this.prisma.pages.create({
      data: data as any,
      include: { sections: { orderBy: { order_index: 'asc' } } }
    });
  }

  update(artistId: string, pageId: string, payload: UpsertPageDto) {
    const data: Record<string, unknown> = {
      artist_id: artistId,
      title: payload.title,
      slug: payload.slug,
      is_hidden: this.resolveVisibility(payload),
      sections: {
        deleteMany: { page_id: pageId },
        create: payload.sections.map((section, index) => ({
          type: section.type,
          data: section.data ?? {},
          order_index: index,
          is_visible: section.isVisible ?? true
        }))
      }
    };

    if (payload.seoDescription !== undefined) {
      data.seo_description = payload.seoDescription;
    }

    return this.prisma.pages.update({
      where: { id: pageId },
      data: data as any,
      include: { sections: { orderBy: { order_index: 'asc' } } }
    });
  }

  patch(pageId: string, payload: PatchPageDto) {
    const { sections = undefined, status, ...rest } = payload;
    const data: Record<string, unknown> = {
      ...('title' in rest ? { title: rest.title } : {}),
      ...('slug' in rest ? { slug: rest.slug } : {}),
      ...('isHidden' in rest ? { is_hidden: rest.isHidden } : {}),
      ...(status ? { is_hidden: status === PageStatusDto.Draft } : {})
    };

    if ('seoDescription' in rest) {
      data.seo_description = rest.seoDescription;
    }

    if (sections) {
      data.sections = {
        deleteMany: { page_id: pageId },
        create: sections.map((section: SectionDto, index: number) => ({
          type: section.type,
          data: section.data ?? {},
          order_index: index,
          is_visible: section.isVisible ?? true
        }))
      };
    }

    return this.prisma.pages.update({
      where: { id: pageId },
      data,
      include: { sections: { orderBy: { order_index: 'asc' } } }
    });
  }

  private resolveVisibility(payload: UpsertPageDto) {
    if (payload.status) {
      return payload.status === PageStatusDto.Draft;
    }
    if (typeof payload.isHidden === 'boolean') {
      return payload.isHidden;
    }
    return false;
  }

  private mapFixturePage(artistId: string, page: any, includeSections?: boolean) {
    const base: Record<string, unknown> = {
      id: page.id,
      artist_id: artistId,
      title: page.title,
      slug: page.slug[page.slug.length - 1] ?? page.slug[0],
      full_slug: page.slug,
      is_hidden: page.status !== PageStatusDto.Published,
      seo_description: page.seoDescription ?? null,
      theme: page.theme,
      updated_at: page.updatedAt
    };

    if (includeSections) {
      base.sections = page.sections.map((section: SectionDto, index: number) => ({
        id: `${page.id}-section-${index}`,
        type: section.type,
        data: section.data ?? {},
        order_index: index,
        is_visible: section.isVisible ?? true
      }));
    }

    return base;
  }
}
