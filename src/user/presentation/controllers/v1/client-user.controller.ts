import { Controller, UseInterceptors, Version, Headers, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DefaultHeadersInterceptor } from 'src/common/interceptor';
import { GetLanguageDto, GetVersionDto, RateLimit } from 'src/common';
import { UserDataOpenApiDecorator } from '../../decorators';
import { UserInformationUseCase } from 'src/user/application/usecases';
import { UserDataResponseDto } from '../../dto';

@UseInterceptors(new DefaultHeadersInterceptor())
@ApiTags('User [Client]')
@Controller('client/v1/user')
export class ClientV1UserController {

  constructor(private readonly userInformationUseCase: UserInformationUseCase) {}

  @Version('1')
  @Get('/data')
  @RateLimit(Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, Number(process.env.RATE_LIMIT_WINDOW_IN_SECONDS) || 60)
  @UserDataOpenApiDecorator()
  public async GetUserData(
    @Headers() { language }: GetLanguageDto,
    @Headers() {}: GetVersionDto,
    @Headers('userId') userId: string,
  ): Promise<UserDataResponseDto> {
    return this.userInformationUseCase.GetUserData(userId, language);
  }
}
