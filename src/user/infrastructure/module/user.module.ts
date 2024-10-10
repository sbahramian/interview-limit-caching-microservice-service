import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UserMongoFactory, UserRedisFactory } from '../../domain/services/factories';
import { UserMongoRepository, UserRedisRepository } from '../../domain/services/repositories';
import { UserInformationUseCase } from '../../application/usecases';
import { QueryHandlers } from '../../application/services/queries';
import { CommandHandlers } from '../../application/services/commands';
import { UserKeyManagerUtility } from '../../application/services/utilities';
import { User, UserSchema } from 'src/user/domain/models/entities';
import { ClientV1UserController } from 'src/user/presentation/controllers';
import { RateLimitInterceptor } from 'src/common';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'sample-db'),
    CqrsModule,
  ],
  controllers: [
    ClientV1UserController,
  ],
  providers: [
    // Utility
    UserKeyManagerUtility,
    // UseCase
    UserInformationUseCase,
    // Handler
    ...QueryHandlers,
    ...CommandHandlers,
    // Factory
    UserMongoFactory,
    UserRedisFactory,
    // Repository
    UserMongoRepository,
    UserRedisRepository,
    //
    RateLimitInterceptor,
  ],
  exports: [
    // UseCase
    UserInformationUseCase,
  ],
})
export class UserModule {}
