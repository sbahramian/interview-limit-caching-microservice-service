import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MessageInterface, CodeMessageInterface, TextMessageInterface } from '../interfaces';

export class CodeMessageDto {
  @ApiProperty()
  @IsString()
  enum?: string;

  @ApiProperty()
  @IsNumber()
  number?: number;

  constructor(data: Partial<CodeMessageInterface>) {
    this.enum = data.enum;
    this.number = data.number;
  }
}

export class TextMessageDto {
  @ApiProperty()
  @IsString()
  developer?: string;

  @ApiProperty()
  @IsNumber()
  client?: string;

  constructor(data: Partial<TextMessageInterface>) {
    this.developer = data.developer;
    this.client = data.client;
  }
}

export class MessageDto {
  @ApiProperty({
    type: CodeMessageDto,
  })
  code!: CodeMessageDto;

  @ApiProperty({
    type: TextMessageDto,
  })
  text!: TextMessageDto;

  constructor(data: Partial<MessageInterface>) {
    this.code = new CodeMessageDto(data.code || {});
    this.text = new TextMessageDto(data.text || {});
  }
}
