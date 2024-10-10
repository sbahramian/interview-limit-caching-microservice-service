import { FilterQuery, ProjectionType, QueryOptions, SortOrder, UpdateQuery } from 'mongoose';

export type Optional<T> = { [P in keyof T]?: T[P] };

export type UpdateType<T> = UpdateQuery<Optional<T>> & Optional<T>;

export type FilterType<T> = {
  skip?: number;
  limit?: number;
  scope?: string;
  sort?: string | { [key: string]: SortOrder | { $meta: 'textScore' } };
  query?: FilterQuery<T>;
  update?: UpdateType<T>;
  options?: QueryOptions<T>;
  projection?: ProjectionType<T>;
};
