import { Controller, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(SupabaseAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('current')
  getCurrent(@Req() request: Request) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.accountsService.getOverviewForUser(userId);
  }

  @Get(':accountId/artists')
  getArtists(@Param('accountId') accountId: string, @Req() request: Request) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.accountsService.getArtistsForAccount(accountId, userId);
  }
}

