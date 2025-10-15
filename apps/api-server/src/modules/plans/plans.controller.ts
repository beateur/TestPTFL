import { Controller, Get } from '@nestjs/common';

@Controller('plans')
export class PlansController {
  @Get()
  list() {
    return [
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
  }
}
