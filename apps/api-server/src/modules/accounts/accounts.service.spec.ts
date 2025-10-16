import { PlansService } from '../plans/plans.service';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  it('returns fallback account with enforced plan limits when database is unavailable', async () => {
    const prismaMock = {
      accounts: {
        findFirst: jest.fn().mockRejectedValue(new Error('connection error'))
      }
    } as any;

    const service = new AccountsService(prismaMock, new PlansService());
    const overview = await service.getOverviewForUser('user-123');

    expect(overview.account.plan.id).toBe('pro');
    const freemiumArtist = overview.artists.find((artist) => artist.planId === 'freemium');
    expect(freemiumArtist?.limit.state).toBe('blocked');
    expect(prismaMock.accounts.findFirst).toHaveBeenCalled();
  });
});

