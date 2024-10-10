import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CursorPaginationDto {
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
  limit = 5;

  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiProperty({
    type: String,
    required: false,
  })
  cursor?: string;

  @IsOptional()
  @IsBoolean()
  /* eslint-disable @typescript-eslint/no-explicit-any */
  @Transform((item: any) => {
    if (item.value === 'true') return true;
    return false;
  })
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  include_cursor?: boolean;
}
