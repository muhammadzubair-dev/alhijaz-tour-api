// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.secret =
      this.configService.get<string>('JWT_SECRET') || 'secret value';
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1d';
  }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
