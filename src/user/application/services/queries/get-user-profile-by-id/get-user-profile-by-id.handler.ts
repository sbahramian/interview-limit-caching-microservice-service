import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UserRedisRepository } from '../../../../domain/services/repositories';
import { GetUserDataResponseInterface, UserInterface } from '../../../../application/interfaces';
import { GetUserDataByIdQuery } from './get-user-profile-by-id.query';
import { faker } from '@faker-js/faker';
import { UserRedisFactory } from '../../../../../user/domain/services/factories';
import { UserKeyManagerUtility } from '../../utilities';
import { GetUserDataMap } from '../../../../../user/application/map';
import { localization } from '../../../../../common';
import { LocalizationMessage } from '../../../../../user/infrastructure/localization/enum';

@QueryHandler(GetUserDataByIdQuery)
export class GetUserDataByIdHandler implements IQueryHandler<GetUserDataByIdQuery> {
  constructor(
    private readonly userKeyManagerUtility: UserKeyManagerUtility,
    private readonly userRedisFactory: UserRedisFactory,
    private readonly userRedisRepository: UserRedisRepository,
  ) {}

  async execute(query: GetUserDataByIdQuery): Promise<GetUserDataResponseInterface> {   
    let user = {} as UserInterface;
    
    const exist = await this.userIdExist(query.userId);
    if (!exist) {
      user = this.createRandomUser(query.userId);
      await this.cacheUserProfile(user);
    } else {
      user = await this.userFindById(query.userId);
    }

    return GetUserDataMap.item(user);
  }

  private async userIdExist(userId: string): Promise<boolean> {
    const key = this.userKeyManagerUtility.GetUserKey(userId);
    try {
      const exist = await this.userRedisRepository.IsExist(key);
      console.log("userIdExist", {key, exist})
      return exist;
    } catch (error) {
      console.log(localization.message(LocalizationMessage.REDIS_SERVICE_DOWN, null, true));
      return false;
    }    
  }

  private async userFindById(userId: string): Promise<GetUserDataResponseInterface> {
    const key = this.userKeyManagerUtility.GetUserKey(userId);
    const user = await this.userRedisRepository.Find(key) as GetUserDataResponseInterface;
    console.log("userFindById", {key, user})
    return user;
  }

  protected createRandomUser(userId: string): UserInterface {
    const user = {} as UserInterface;
    user.userId = userId;
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.gender = faker.person.sex();
    user.bio = faker.person.bio();
    user.jobTitle = faker.person.jobTitle();
    user.avatar = faker.image.avatar();
    user.phone = faker.phone.number();
    user.streetAddress = faker.location.streetAddress();
    return user;
  }

  private async cacheUserProfile(user: UserInterface): Promise<void> {
    const expiresIn = Number(process.env.EXPIRES_CACHE_TIME) || 60;
    const key = this.userKeyManagerUtility.GetUserKey(user.userId);
    console.log("cacheUserProfile", {key, expiresIn, user})
    try {
      await this.userRedisFactory.Upsert(key, user, expiresIn);
    } catch (error) {
      console.log(localization.message(LocalizationMessage.REDIS_SERVICE_DOWN, null, true))
    }
  }
}
