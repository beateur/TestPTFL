import { Logger } from '@nestjs/common';
import { RuntimeService } from './runtime.service';
import { PlansService } from '../plans/plans.service';
import { RuntimeContactDto } from './runtime.dto';
import { PrismaService } from '../../lib/prisma.service';

describe('RuntimeService', () => {
  const prisma = {} as unknown as PrismaService;
  const plansService = new PlansService();
  const service = new RuntimeService(prisma, plansService);

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn());
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(jest.fn());
  });

  it('returns fallback artist when host is unknown in database', async () => {
    const resolution = await service.resolveHost('lys-astrale.portfolio.local');
    expect(resolution.artist.slug).toBe('lys-astrale');
    expect(resolution.navigation).toHaveLength(3);
  });

  it('throws when submitting contact for plan without contact', async () => {
    const payload: RuntimeContactDto = {
      artistId: 'artist-atelier-nova',
      name: 'Camille',
      email: 'camille@example.com',
      message: 'Bonjour'
    };

    await expect(service.submitContactRequest(payload)).rejects.toThrow('plan');
  });

  it('accepts contact submissions for artists with contact-enabled plan', async () => {
    const payload: RuntimeContactDto = {
      artistId: 'artist-lys-astrale',
      name: 'Camille',
      email: 'camille@example.com',
      message: 'Bonjour'
    };

    const response = await service.submitContactRequest(payload);
    expect(response.status).toBe('queued');
  });
});
