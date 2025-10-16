import { Injectable } from '@nestjs/common';

export interface PlanDefinition {
  id: string;
  name: string;
  price: number;
  pageLimit: number | null;
  storageLimitMb: number;
  contactEnabled: boolean;
  collaborators?: string;
}

@Injectable()
export class PlansService {
  private readonly plans: PlanDefinition[] = [
    { id: 'freemium', name: 'Freemium', price: 0, pageLimit: 3, storageLimitMb: 1024, contactEnabled: false },
    { id: 'pro', name: 'Pro', price: 29, pageLimit: null, storageLimitMb: 10240, contactEnabled: true },
    {
      id: 'studio',
      name: 'Studio',
      price: 79,
      pageLimit: null,
      storageLimitMb: 51200,
      contactEnabled: true,
      collaborators: 'illimités'
    }
  ];

  list(): PlanDefinition[] {
    return this.plans;
  }

  findById(id: string): PlanDefinition {
    return this.plans.find((plan) => plan.id === id) ?? this.plans[0];
  }
}

