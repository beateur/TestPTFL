import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './artists.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateArtistDto) {
    return this.artistsService.create(payload);
  }
}
