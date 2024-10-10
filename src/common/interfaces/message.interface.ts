export interface CodeMessageInterface {
  enum: string;
  number: number;
}

export interface TextMessageInterface {
  developer: string;
  client: string;
}

export interface MessageInterface {
  code: CodeMessageInterface;
  text: TextMessageInterface;
}

export interface MetaPaginationInterface {
  countPage?: number;
  currentPage?: number;
  nextPage?: number | null;
  previousPage?: number | null;
  perPage?: number;
  from?: number | null;
  to?: number | null;
  total?: number;
}

export interface MetaInterface {
  serverTime?: Date;
  hasError?: boolean;
  pagination?: MetaPaginationInterface;
  message: MessageInterface[];
}
