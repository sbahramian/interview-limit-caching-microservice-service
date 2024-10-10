import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export class UserKeyManagerUtility {
  constructor(@InjectPinoLogger(UserKeyManagerUtility.name) private readonly logger: PinoLogger) {}

  public GetUserKey(userId: string): string {
    return `user:profile:${userId}`;
  }
}
