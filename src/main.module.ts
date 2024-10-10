import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { REDIS_CONFIG } from './common/config/redis.config';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { DEFAULT_LANGUAGE_CONFIG, MONGO_CONFIG, MONGO_LOGGING_CONFIG } from './common/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserModule } from './user/infrastructure/module';
import { SentryMiddleware } from './common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE_CONFIG(),
      loaderOptions: {
        path: path.join(__dirname, './i18n/localization/lang/'),
        watch: true,
      },
      resolvers: [new QueryResolver(['lang', 'l']), { use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
      ignoreEnvFile: process.env.ENV_FILES !== 'true',
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          maxRetriesPerRequest: 50,
          url: REDIS_CONFIG('REDIS_DB', 'REDIS_HOST', 'REDIS_USER', 'REDIS_PASS', 'REDIS_PORT'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        mongoose.set('debug', MONGO_LOGGING_CONFIG());
        return {
          uri: MONGO_CONFIG('MONGO_DB', 'MONGO_HOST', 'MONGO_USER', 'MONGO_PASS', 'MONGO_PORT', 'MONGO_QUERY'),
        };
      },
      connectionName: 'sample-db',
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'debug'),
          prettyPrint: configService.get<string>('LOG_PRETTY', 'false') === 'true',
        },
      }),
    }),
    CqrsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
