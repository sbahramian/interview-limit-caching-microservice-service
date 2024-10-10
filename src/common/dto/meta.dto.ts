import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class MetaPaginationDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  total?: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  countPage?: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  currentPage?: number;

  @ApiProperty({
    type: Number || null,
  })
  @IsOptional()
  nextPage?: number | null;

  @ApiProperty({
    type: Number || null,
  })
  @IsOptional()
  previousPage?: number | null;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  perPage?: number;

  @ApiProperty({
    type: Number || null,
  })
  @IsOptional()
  from?: number | null;

  @ApiProperty({
    type: Number || null,
  })
  @IsOptional()
  to?: number | null;
}

export class MetaDto {
  @ApiProperty({
    type: Date,
  })
  serverTime?: Date;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  hasError?: boolean = false;

  @ApiProperty({
    type: [MessageDto],
  })
  message!: MessageDto[];

  @ApiProperty({
    type: MetaPaginationDto,
  })
  pagination?: MetaPaginationDto;
}
