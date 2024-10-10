import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../dto';

export class PaginatedResponse<T> {
  @ApiProperty({
    type: MetaDto,
    required: true,
  })
  readonly meta!: MetaDto;

  @ApiProperty({ isArray: true })
  readonly data: T[];

  constructor(data: T[]) {
    this.meta = {
      pagination: {
        total: 0,
      },
      serverTime: new Date(),
      hasError: true,
      message: [
        {
          code: {
            enum: 'GET_PAGINATION_SUCCESSFULLY!',
            number: 10200,
          },
          text: {
            developer: 'Get list of items process successfully.',
            client: 'Get list of items process successfully.',
          },
        },
      ],
    };
    this.data = data;
  }
}
