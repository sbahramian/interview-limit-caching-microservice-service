/* eslint-disable @typescript-eslint/no-explicit-any */

export const ExtendsWithCommonFilterQuery = (filter: any, ignore_limit?: boolean) => {
  if (!filter?.query) filter.query = {};

  if (!ignore_limit && !filter?.limit) filter.limit = 10;
  if (!ignore_limit && filter?.limit > 100) filter.limit = 100;

  if (!filter.sort) filter.sort = { created_at: -1 };

  if (!filter?.query?.deleted_at) filter.query.deleted_at = { $exists: false };
};

export function RemoveDuplicatesFromArray(inputArray: string[]): string[] {
  const uniqueSet = new Set<string>(inputArray);
  const uniqueArray: string[] = Array.from(uniqueSet);

  return uniqueArray;
}
