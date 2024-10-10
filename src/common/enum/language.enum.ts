import { ApiProperty } from '@nestjs/swagger';

export enum LanguageListEnum {
  ENGLISH = 'ENGLISH',
}

export class Language {
  @ApiProperty({ enum: LanguageListEnum })
  language: LanguageListEnum;

  constructor(data: LanguageListEnum) {
    this.language = data;
  }
}
