import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import { CreateLeadDto } from './leads.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.lead_applications.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  create(data: CreateLeadDto) {
    return this.prisma.lead_applications.create({
      data: {
        name: data.name,
        email: data.email,
        portfolio_url: data.portfolioUrl ?? null,
        goals: data.goals ?? null,
        status: 'pending'
      }
    });
  }
}
