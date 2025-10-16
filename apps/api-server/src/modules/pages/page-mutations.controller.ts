import { Body, Controller, Param, Patch } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PatchPageDto } from './pages.dto';

@Controller('pages')
export class PageMutationsController {
  constructor(private readonly pagesService: PagesService) {}

  @Patch(':pageId')
  patch(@Param('pageId') pageId: string, @Body() payload: PatchPageDto) {
    return this.pagesService.patch(pageId, payload);
  }
}
