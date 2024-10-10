import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDataInformation, UserDataInformationSuccessResponse } from '../openapis';
import { CommonResponseOpenApi } from 'src/common';

export function UserDataOpenApiDecorator() {
  return applyDecorators(
    ApiOperation(UserDataInformation),
    ApiResponse(UserDataInformationSuccessResponse),
    ApiResponse(CommonResponseOpenApi.InternalServerErrorResponse),
    ApiResponse(CommonResponseOpenApi.ServiceUnavaiableResponse),
    ApiResponse(CommonResponseOpenApi.TooManyRequestResponse),
  );
}
