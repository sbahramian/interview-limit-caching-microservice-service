export interface CursorPaginationRequestInterface {
  limit: number;
  cursor?: string;
  include_cursor?: boolean;
  search?: string;
}

export interface PageSizePaginationRequestInterface {
  page: number;
  size: number;
  search?: string;
}

export interface LimitOffsetPaginationRequestInterface {
  limit: number;
  offset: number;
  search?: string;
}
