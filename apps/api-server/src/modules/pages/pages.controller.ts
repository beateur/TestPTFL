import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PagesService } from './pages.service';
import { UpsertPageDto } from './pages.dto';

@Controller('artists/:artistId/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findAll(@Param('artistId') artistId: string) {
    return this.pagesService.listByArtist(artistId);
  }

  @Get(':pageId')
  findOne(@Param('artistId') artistId: string, @Param('pageId') pageId: string) {
    return this.pagesService.findOne(artistId, pageId);
  }

  @Post()
  create(@Param('artistId') artistId: string, @Body() payload: UpsertPageDto) {
    return this.pagesService.create(artistId, payload);
  }

  @Put(':pageId')
  update(@Param('artistId') artistId: string, @Param('pageId') pageId: string, @Body() payload: UpsertPageDto) {
    return this.pagesService.update(artistId, pageId, payload);
  }
}
