import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseAuthService, type SupabaseUser } from './supabase-auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly authService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: SupabaseUser }>();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [, token] = authorization.split(' ');
    if (!token) {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    request.user = await this.authService.verifyAccessToken(token);
    return true;
  }
}

