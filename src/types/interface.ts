export interface APIMetaResponse<T> {
  data: T[];
  meta?: Meta;
  message: string | null;
  statusCode: number;
}

export interface Meta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

interface IBaseType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
