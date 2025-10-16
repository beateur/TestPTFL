import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ResolveHostQueryDto, RuntimeContactDto, RuntimeEventDto } from './runtime.dto';
import { RuntimeService } from './runtime.service';

@Controller('runtime')
export class RuntimeController {
  constructor(private readonly runtimeService: RuntimeService) {}

  @Get('resolve')
  resolve(@Query() query: ResolveHostQueryDto) {
    return this.runtimeService.resolveHost(query.host);
  }

  @Post('events')
  recordEvent(@Body() payload: RuntimeEventDto) {
    return this.runtimeService.recordEvent(payload);
  }

  @Post('contact')
  submitContact(@Body() payload: RuntimeContactDto) {
    return this.runtimeService.submitContactRequest(payload);
  }
}
