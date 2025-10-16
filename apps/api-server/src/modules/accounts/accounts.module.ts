import { Module } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { PlansModule } from '../plans/plans.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [PlansModule],
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, SupabaseAuthService, SupabaseAuthGuard],
  exports: [AccountsService]
})
export class AccountsModule {}

