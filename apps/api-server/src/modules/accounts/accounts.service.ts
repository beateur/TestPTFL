import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { PlansService, type PlanDefinition } from '../plans/plans.service';

interface ArtistRecord {
  id: string;
  display_name: string;
  slug: string;
  plan_id?: string | null;
  pages?: { id: string }[];
  storage_usage_mb?: number | null;
}

interface AccountRecord {
  id: string;
  name: string;
  plan_id: string;
  status: string;
  storage_usage_mb?: number | null;
  artists?: ArtistRecord[];
}

export interface PlanUsage {
  pages: number;
  storageMb: number;
}

export interface LimitIndicator {
  state: 'ok' | 'warning' | 'blocked';
  message?: string;
  metric: 'pages' | 'storage';
}

export interface ArtistSummary {
  id: string;
  name: string;
  slug: string;
  planId: string;
  pageCount: number;
  storageMb: number;
  limit: LimitIndicator;
}

export interface AccountOverview {
  account: {
    id: string;
    name: string;
    plan: PlanDefinition;
    status: string;
    usage: PlanUsage;
  };
  artists: ArtistSummary[];
}

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService, private readonly plansService: PlansService) {}

  async getOverviewForUser(userId: string): Promise<AccountOverview> {
    const account = await this.fetchAccountFromDatabase(userId);
    const plan = this.plansService.findById(account.plan_id ?? 'freemium');
    const artists = (account.artists ?? []).map((artist) =>
      this.mapArtistSummary(artist, artist.plan_id ? this.plansService.findById(artist.plan_id) : plan)
    );

    const usage = this.aggregateUsage(account, artists);

    return {
      account: {
        id: account.id,
        name: account.name,
        plan,
        status: account.status,
        usage
      },
      artists
    };
  }

  async getArtistsForAccount(accountId: string, userId: string): Promise<ArtistSummary[]> {
    const overview = await this.getOverviewForUser(userId);
    if (overview.account.id !== accountId) {
      throw new ForbiddenException('Accès refusé à ce compte');
    }
    return overview.artists;
  }

  private async fetchAccountFromDatabase(userId: string): Promise<AccountRecord> {
    try {
      const record = await this.prisma.accounts.findFirst({
        where: { owner_user_id: userId },
        include: {
          artists: {
            include: {
              pages: true
            }
          }
        }
      });

      if (!record) {
        return this.buildFallbackAccount();
      }

      return record as AccountRecord;
    } catch (error) {
      return this.buildFallbackAccount();
    }
  }

  private buildFallbackAccount(): AccountRecord {
    return {
      id: 'demo-account',
      name: 'Compte de démonstration',
      plan_id: 'pro',
      status: 'active',
      storage_usage_mb: 5120,
      artists: [
        {
          id: 'atelier-nova',
          display_name: 'Atelier Nova',
          slug: 'atelier-nova',
          plan_id: 'pro',
          pages: new Array(5).fill(null).map((_, index) => ({ id: `page-${index}` })),
          storage_usage_mb: 2048
        },
        {
          id: 'lune-onirique',
          display_name: 'Lune Onirique',
          slug: 'lune-onirique',
          plan_id: 'freemium',
          pages: new Array(3).fill(null).map((_, index) => ({ id: `lune-page-${index}` })),
          storage_usage_mb: 1024
        }
      ]
    };
  }

  private mapArtistSummary(artist: ArtistRecord, plan: PlanDefinition): ArtistSummary {
    const pageCount = artist.pages?.length ?? 0;
    const storageMb = artist.storage_usage_mb ?? 0;
    const usage: PlanUsage = { pages: pageCount, storageMb };
    const limit = this.evaluateLimit(usage, plan);

    return {
      id: artist.id,
      name: artist.display_name,
      slug: artist.slug,
      planId: plan.id,
      pageCount,
      storageMb,
      limit
    };
  }

  private aggregateUsage(account: AccountRecord, artists: ArtistSummary[]): PlanUsage {
    const totalPages = artists.reduce((acc, artist) => acc + artist.pageCount, 0);
    const storageMb = account.storage_usage_mb ?? artists.reduce((acc, artist) => acc + artist.storageMb, 0);
    return { pages: totalPages, storageMb };
  }

  private evaluateLimit(usage: PlanUsage, plan: PlanDefinition): LimitIndicator {
    if (plan.pageLimit && usage.pages >= plan.pageLimit) {
      return {
        state: 'blocked',
        metric: 'pages',
        message: "Limite de pages atteinte pour ce plan"
      };
    }

    if (plan.pageLimit && usage.pages / plan.pageLimit >= 0.8) {
      return {
        state: 'warning',
        metric: 'pages',
        message: 'Vous approchez de la limite de pages incluse dans votre abonnement.'
      };
    }

    if (plan.storageLimitMb && usage.storageMb >= plan.storageLimitMb) {
      return {
        state: 'blocked',
        metric: 'storage',
        message: 'Espace de stockage saturé. Veuillez libérer de la place ou passer au plan supérieur.'
      };
    }

    if (plan.storageLimitMb && usage.storageMb / plan.storageLimitMb >= 0.8) {
      return {
        state: 'warning',
        metric: 'storage',
        message: 'Espace de stockage presque saturé.'
      };
    }

    return { state: 'ok', metric: 'pages' };
  }
}

