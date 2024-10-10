import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';

@Injectable()
export class BaseMongoFactory<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  public async Create(data: Partial<T>): Promise<T> {
    return this.model.create({
      ...data,
      created_at: new Date(),
    });
  }

  public async InsertMany(data: Partial<T>[]) {
    const documents = data.map((item) => ({
      ...item,
      created_at: new Date(),
    }));

    return await this.model.insertMany(documents);
  }
}
