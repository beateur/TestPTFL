import { Module } from '@nestjs/common';
import { RuntimeController } from './runtime.controller';
import { RuntimeService } from './runtime.service';
import { PlansModule } from '../plans/plans.module';
import { PrismaService } from '../../lib/prisma.service';

@Module({
  imports: [PlansModule],
  controllers: [RuntimeController],
  providers: [RuntimeService, PrismaService]
})
export class RuntimeModule {}
