import { applyDecorators, UseInterceptors, SetMetadata } from '@nestjs/common';
import { RateLimitInterceptor } from '../interceptor';

export function RateLimit(maxRequests = 10, windowInSeconds = 60) {
  return applyDecorators(
    SetMetadata('rateLimitMaxRequests', maxRequests),
    SetMetadata('rateLimitWindowInSeconds', windowInSeconds),
    UseInterceptors(RateLimitInterceptor),
  );
}
