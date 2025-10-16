import { PagesService } from './pages.service';
import { PageStatusDto } from './pages.dto';

describe('PagesService', () => {
  it('maps status draft to hidden when creating a page', async () => {
    const prismaMock = {
      pages: {
        create: jest.fn().mockResolvedValue({ id: 'page-1' })
      }
    } as any;

    const service = new PagesService(prismaMock);

    await service.create('artist-1', {
      title: 'Nouvelle page',
      slug: 'nouvelle-page',
      status: PageStatusDto.Draft,
      sections: []
    });

    expect(prismaMock.pages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          artist_id: 'artist-1',
          is_hidden: true
        })
      })
    );
  });

  it('applies partial updates and recomputes visibility on patch', async () => {
    const prismaMock = {
      pages: {
        update: jest.fn().mockResolvedValue({ id: 'page-1' })
      }
    } as any;

    const service = new PagesService(prismaMock);

    await service.patch('page-1', {
      status: PageStatusDto.Published,
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          isVisible: true,
          data: { heading: 'Titre' }
        }
      ]
    });

    expect(prismaMock.pages.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          is_hidden: false,
          sections: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({
                type: 'hero',
                order_index: 0
              })
            ])
          })
        })
      })
    );
  });

  it('returns fixture pages when database lookup fails', async () => {
    const prismaMock = {
      pages: {
        findMany: jest.fn().mockRejectedValue(new Error('db down'))
      }
    } as any;

    const service = new PagesService(prismaMock);

    const pages = await service.listByArtist('artist-lys-astrale', {
      status: PageStatusDto.Published,
      includeSections: true
    });

    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0]).toHaveProperty('sections');
  });
});
