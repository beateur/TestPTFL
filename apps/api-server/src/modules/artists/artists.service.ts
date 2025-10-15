import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { CreateArtistDto } from './artists.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.artists.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artists.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }
    return artist;
  }

  create(data: CreateArtistDto) {
    return this.prisma.artists.create({
      data: {
        account_id: data.accountId,
        display_name: data.displayName,
        bio: data.bio ?? null,
        theme: data.theme ?? null
      }
    });
  }
}
