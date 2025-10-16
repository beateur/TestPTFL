import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PageMutationsController } from './page-mutations.controller';
import { PrismaService } from '../../lib/prisma.service';

@Module({
  controllers: [PagesController, PageMutationsController],
  providers: [PagesService, PrismaService]
})
export class PagesModule {}
