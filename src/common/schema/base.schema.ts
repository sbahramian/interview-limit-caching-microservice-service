import { Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class BaseSchema {
  id?: string;

  _id?: Types.ObjectId;

  @Prop({ type: Date, required: false, default: () => new Date() })
  created_at?: Date;

  @Prop({ type: Date, required: false })
  updated_at?: Date;

  @Prop({ type: Date, required: false })
  deleted_at?: Date;

  @Prop({ required: false, type: Date })
  restored_at?: Date;

  constructor(schema?: Partial<BaseSchema>) {
    if (schema) Object.assign(this, schema);
  }
}

export type BaseDocument = BaseSchema & Document;
