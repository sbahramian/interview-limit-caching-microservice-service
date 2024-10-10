import { Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';

@Schema({
  _id: false,
  id: false,
})
export class UserProcess {
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  @ApiProperty({ type: Boolean, required: false, default: false })
  signup_completed: boolean;

  constructor(process: Partial<UserProcess>) {
    Object.assign(this, process);
  }
}
