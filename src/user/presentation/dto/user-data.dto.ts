import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MetaDto } from 'src/common';

export class GetUserIdDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  userId: string;
  

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  firstName: string;


  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  streetAddress: string;
}

export class UserDataDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  lastName: string;
}

export class UserDataResponseDto {
  @ApiProperty({
    type: UserDataDto,
  })
  data!: UserDataDto;

  @ApiProperty({
    type: MetaDto,
  })
  meta!: MetaDto;
}
