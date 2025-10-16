import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AccountsService } from '../accounts/accounts.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Controller('auth')
@UseGuards(SupabaseAuthGuard)
export class AuthController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('profile')
  async getProfile(@Req() request: Request) {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const overview = await this.accountsService.getOverviewForUser(user.id);
    return {
      user,
      account: overview.account
    };
  }
}

