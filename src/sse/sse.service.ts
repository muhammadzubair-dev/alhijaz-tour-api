import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import { RedisService } from '../common/redis.service';

@Injectable()
export class SseService implements OnModuleInit {
  private clients: Map<string, Subject<any>> = new Map();
  private readonly CHANNEL = 'SSE_CHANNEL';

  // eslint-disable-next-line prettier/prettier
  constructor(private readonly redis: RedisService) { }

  onModuleInit() {
    this.redis.subscribeEvent(this.CHANNEL, (msg) => {
      const { userId, payload } = msg;
      const client$ = this.clients.get(userId);
      if (client$) {
        client$.next({ data: payload });
      }
    });
  }

  registerClient(userId: string, subject$: Subject<any>) {
    this.clients.set(userId, subject$);
    console.log(
      `🔌 User SSE connected: ${userId}. Total: ${this.clients.size}`,
    );
  }

  removeClient(userId: string) {
    const subject$ = this.clients.get(userId);
    subject$?.complete();
    this.clients.delete(userId);
    console.log(
      `❌ User SSE disconnected: ${userId}. Total: ${this.clients.size}`,
    );
  }

  async sendToUser(userId: string, payload: any) {
    await this.redis.publishEvent(this.CHANNEL, { userId, payload });
  }
}
