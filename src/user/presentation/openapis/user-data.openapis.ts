import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UserDataResponseDto } from '../dto';

export const UserDataInformation: ApiOperationOptions = {
  summary: 'User data',
  description: 'User data API',
};

export const UserDataInformationSuccessResponse: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'User data process has been successful.',
  type: UserDataResponseDto,
};
