import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetVersionDto {
  @ApiProperty({
    type: Number,
    default: 1,
  })
  @IsInt()
  @Min(1)
  version: number = 1;
}
