import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { PageStatusDto, PatchPageDto, SectionDto, UpsertPageDto } from './pages.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  listByArtist(artistId: string) {
    return this.prisma.pages.findMany({
      where: { artist_id: artistId },
      orderBy: { order_index: 'asc' }
    });
  }

  async findOne(artistId: string, pageId: string) {
    const page = await this.prisma.pages.findFirst({
      where: { id: pageId, artist_id: artistId },
      include: { sections: { orderBy: { order_index: 'asc' } } }
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
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
}
