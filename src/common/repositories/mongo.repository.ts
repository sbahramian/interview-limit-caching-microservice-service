import { Injectable } from '@nestjs/common';
import { Model, Document, FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { UpdateType } from '../type';
import { ObjectId } from 'mongodb';
import { PageSizePaginationUtil } from '../util';
import { SortEnum } from '../enum';
import { MetaPaginationInterface } from '../interfaces';

@Injectable()
export class BaseMongoRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  private filterActiveDocument(filter: FilterQuery<T>): FilterQuery<T> {
    if (!filter['deleted_at']) {
      filter = { ...filter, deleted_at: { $exists: false } };
    }

    return filter;
  }

  public async Count(filter: FilterQuery<T> = {}): Promise<number> {
    const query = this.filterActiveDocument(filter);

    return this.model.countDocuments(query).exec();
  }

  public async Find(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {},
    projection?: ProjectionType<T>,
  ): Promise<T[]> {
    const query = this.filterActiveDocument(filter);
    const { skip = 0, limit = 10, sort = { _id: -1 } } = options;

    return this.model.find(query, projection).sort(sort).skip(skip).limit(limit).exec();
  }

  public async CursorPagination(
    filter: FilterQuery<T> = {},
    cursor: string | null,
    include_cursor: boolean = false,
    limit: number = 5,
    sort: SortEnum,
    projection?: ProjectionType<T>,
  ): Promise<{ data: T[]; total: number }> {
    const query = this.filterActiveDocument(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sort_key: any;

    if (cursor) {
      const cursorObjectId = new ObjectId(cursor);
      if (sort == SortEnum.DESC) {
        sort_key = { _id: sort.toLowerCase() };
        if (include_cursor) {
          query._id = { $lte: cursorObjectId };
        } else {
          query._id = { $lt: cursorObjectId };
        }
      } else {
        sort_key = { _id: 1 };
        if (include_cursor) {
          query._id = { $gte: cursorObjectId };
        } else {
          query._id = { $gt: cursorObjectId };
        }
      }
    }

    const [data, total] = await Promise.all([
      this.model.find(query, projection).sort(sort_key).limit(limit).exec(),
      this.model.countDocuments(this.filterActiveDocument(filter)).exec(),
    ]);

    return { data, total };
  }

  public async PageSizePagination(
    filter: FilterQuery<T> = {},
    page: number = 1,
    size: number = 5,
    sort_field: string = 'created_at',
    sort_order: SortEnum,
    projection?: ProjectionType<T>,
  ): Promise<{ data: T[]; pagination: MetaPaginationInterface }> {
    const query = this.filterActiveDocument(filter);
    const skip = PageSizePaginationUtil.preparePaginationParams(page, size);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sort: any;
    const sortOrderLower = sort_order.toLowerCase();
    if (sort_field === '_id') {
      sort = { _id: sortOrderLower === 'asc' ? 1 : -1 };
    } else {
      sort = { [sort_field]: sortOrderLower };
    }

    const [data, total] = await Promise.all([
      this.model.find(query, projection).sort(sort).skip(skip).limit(size).exec(),
      this.model.countDocuments(query).exec(),
    ]);
    const pagination = PageSizePaginationUtil.prepareMetaPage(total, page, size);

    return { data, pagination };
  }

  public async IsExist(filter: FilterQuery<T> = {}): Promise<boolean> {
    const query = this.filterActiveDocument(filter);
    const docCount = await this.model.countDocuments(query).exec();

    return docCount > 0;
  }

  public async FindOne(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {},
    projection?: ProjectionType<T>,
  ): Promise<T | null> {
    const query = this.filterActiveDocument(filter);

    return this.model.findOne(query, projection, options).exec();
  }

  public async UpdateById(id: string, update: UpdateType<T>, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model
      .findOneAndUpdate({ ...filter, _id: id }, { ...update, updated_at: new Date() }, { new: true })
      .exec();
  }

  public async DeleteById(id: string, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOneAndUpdate({ ...filter, _id: id }, { deleted_at: new Date() }, { new: true }).exec();
  }

  public async RestoreById(id: string, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model
      .findOneAndUpdate({ ...filter, _id: id }, { restored_at: new Date(), $unset: { deleted_at: 1 } }, { new: true })
      .exec();
  }

  public async DestroyById(id: string, filter: FilterQuery<T> = {}): Promise<T | null> {
    return this.model.findOneAndDelete({ ...filter, _id: id }, { new: true }).exec();
  }

  public async DeleteMany(filter: FilterQuery<T>) {
    return await this.model.deleteMany(filter);
  }

  public async UpdateManyDocuments(filter: FilterQuery<T>, update: UpdateQuery<T>) {
    return await this.model.updateMany(filter, update);
  }
}
