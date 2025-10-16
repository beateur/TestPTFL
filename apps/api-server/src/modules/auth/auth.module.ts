import { Module } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { AccountsModule } from '../accounts/accounts.module';
import { AuthController } from './auth.controller';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';

@Module({
  imports: [AccountsModule],
  controllers: [AuthController],
  providers: [SupabaseAuthService, SupabaseAuthGuard, PrismaService]
})
export class AuthModule {}

