import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { UpsertPageDto } from './pages.dto';

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
    return this.prisma.pages.create({
      data: {
        artist_id: artistId,
        title: payload.title,
        slug: payload.slug,
        is_hidden: payload.isHidden ?? false,
        sections: {
          create: payload.sections.map((section, index) => ({
            type: section.type,
            data: section.data ?? {},
            order_index: index,
            is_visible: section.isVisible ?? true
          }))
        }
      },
      include: { sections: true }
    });
  }

  update(artistId: string, pageId: string, payload: UpsertPageDto) {
    return this.prisma.pages.update({
      where: { id: pageId },
      data: {
        artist_id: artistId,
        title: payload.title,
        slug: payload.slug,
        is_hidden: payload.isHidden ?? false,
        sections: {
          deleteMany: { page_id: pageId },
          create: payload.sections.map((section, index) => ({
            type: section.type,
            data: section.data ?? {},
            order_index: index,
            is_visible: section.isVisible ?? true
          }))
        }
      },
      include: { sections: true }
    });
  }
}
