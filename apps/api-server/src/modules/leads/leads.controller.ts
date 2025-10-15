import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './leads.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Post()
  create(@Body() body: CreateLeadDto) {
    return this.leadsService.create(body);
  }
}
