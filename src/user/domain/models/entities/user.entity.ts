import { buildSchema, Prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/common';

export class User extends BaseSchema {

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  lastName: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export type UserDocument = User & Document;
export const UserSchema = buildSchema(User);
