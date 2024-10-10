import { HttpStatus, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetUserDataByIdQuery,
} from '../services/queries';
import { GetUserDataResponse } from '../interfaces';
import { LocalizationMessage } from '../../infrastructure/localization/enum';
import { localization } from 'src/common';

@Injectable()
export class UserInformationUseCase {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  public async GetUserData(userId: string, lang: string): Promise<GetUserDataResponse> {
    try {
      const data = await this.queryBus.execute(new GetUserDataByIdQuery(userId, lang));

      return {
        data: data,
        meta: {
          ...localization.message(LocalizationMessage.GET_USER_PROFILE_SUCCESSFULLY, { lang }),
        },
      };
    } catch (error) {
      if (error?.response?.meta) throw error;
      localization.message(
        LocalizationMessage.INTERNAL_SERVER_ERROR,
        { lang },
        true,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }
}
