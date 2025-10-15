import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { PagesModule } from './modules/pages/pages.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    LeadsModule,
    ArtistsModule,
    PagesModule,
    PlansModule
  ]
})
export class AppModule {}
