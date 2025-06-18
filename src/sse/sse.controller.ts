import { Controller, Req, Sse, MessageEvent, Get } from '@nestjs/common';
import { Subject } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly sseService: SseService) { }

  @Get()
  @Sse()
  connect(@Req() req: any): Subject<MessageEvent> {
    const user = req.user as any;
    const userId = String(user?.id);
    const subject$ = new Subject<MessageEvent>();

    this.sseService.registerClient(userId, subject$);
    req.on('close', () => this.sseService.removeClient(userId));

    return subject$;
  }
}
