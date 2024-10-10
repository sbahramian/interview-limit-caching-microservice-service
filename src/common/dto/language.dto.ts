import { ApiProperty } from '@nestjs/swagger';
import { LanguageListEnum } from '../enum';
import { IsEnum } from 'class-validator';

export class GetLanguageDto {
  @ApiProperty({
    type: String,
    enum: LanguageListEnum,
    default: LanguageListEnum.ENGLISH,
  })
  @IsEnum(LanguageListEnum)
  language: LanguageListEnum = LanguageListEnum.ENGLISH;
}
