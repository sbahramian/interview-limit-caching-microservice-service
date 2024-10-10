import Redis from 'ioredis';
import { RateLimitInterceptor } from './rate-limit.interceptor';
import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LocalizationMessage } from '../../user/infrastructure/localization/enum';

jest.mock('ioredis');

describe('RateLimitInterceptor', () => {
  let interceptor: RateLimitInterceptor;
  let reflector: Reflector;
  let redisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new RateLimitInterceptor(reflector);

    // Mock Redis client
    redisClient = new Redis() as jest.Mocked<Redis>;

    // Instead of assigning, we'll just mock the methods we need
    (interceptor as any).redisClient.get = redisClient.get;
    (interceptor as any).redisClient.set = redisClient.set;
    (interceptor as any).redisClient.incr = redisClient.incr;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockExecutionContext = (headers: Record<string, string | undefined>) => {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers }),
      }),
      getHandler: jest.fn().mockReturnValue({}), // Mock getHandler for Reflector
    } as unknown as ExecutionContext;
  };

  it('should allow requests if within limit', async () => {
    const context = mockExecutionContext({
      language: 'ENGLISH',
      version: '1',
      userid: '123',
    });

    const callHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of(true)),
    };

    // Mock Redis behavior
    redisClient.get.mockResolvedValue(null); // Simulate no previous requests
    redisClient.set.mockResolvedValue('OK');

    // Mock Reflector to return rate limit settings
    reflector.get = jest.fn().mockReturnValueOnce(5).mockReturnValueOnce(60); // maxRequests, windowInSeconds

    const result = await interceptor.intercept(context, callHandler);

    expect(result).toBeTruthy();
    expect(redisClient.set).toHaveBeenCalledWith('user:rate-limit:123', '1', 'EX', 60);
  });

  it('should increment request count if within limit', async () => {
    const context = mockExecutionContext({
      language: 'ENGLISH',
      version: '1',
      userid: '123',
    });

    const callHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of(true)),
    };

    // Mock Redis behavior
    redisClient.get.mockResolvedValue('3'); // Simulate 3 previous requests
    redisClient.incr.mockResolvedValue(4);

    // Mock Reflector to return rate limit settings
    reflector.get = jest.fn().mockReturnValueOnce(5).mockReturnValueOnce(60); // maxRequests, windowInSeconds

    const result = await interceptor.intercept(context, callHandler);

    expect(result).toBeTruthy();
    expect(redisClient.incr).toHaveBeenCalledWith('user:rate-limit:123');
  });

  it('should throw error if request limit exceeded', async () => {
    const context = mockExecutionContext({
      language: 'ENGLISH',
      version: '1',
      userid: '123',
    });

    const callHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of(true)),
    };

    // Mock Redis behavior
    redisClient.get.mockResolvedValue('6'); // Simulate 6 previous requests

    // Mock Reflector to return rate limit settings
    reflector.get = jest.fn().mockReturnValueOnce(5).mockReturnValueOnce(60); // maxRequests, windowInSeconds

    await expect(interceptor.intercept(context, callHandler)).rejects.toThrow(HttpException);

    expect(redisClient.get).toHaveBeenCalledWith('user:rate-limit:123');
  });

  it('should throw error if userId is missing in request headers', async () => {
    const context = mockExecutionContext({
      language: 'ENGLISH',
      version: '1',
    });

    const callHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of(true)),
    };

    await expect(interceptor.intercept(context, callHandler)).rejects.toThrow(
        new HttpException({ meta: { message: LocalizationMessage.USER_NOT_FOUND }}, HttpStatus.NOT_FOUND),
    );      
  });
});
