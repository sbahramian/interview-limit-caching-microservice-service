import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageSizePaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(5)
  @Max(200)
  @ApiProperty({
    type: Number,
    minimum: 5,
    maximum: 200,
    required: false,
    default: 5,
  })
  size: number = 5;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    type: Number,
    minimum: 1,
    required: false,
    default: 1,
  })
  page: number = 1;
}
