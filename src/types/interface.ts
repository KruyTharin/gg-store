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
  createAt: string | Date;
  updatedAt: string | Date;
}

export interface IBillboard extends IBaseType {
  label: string;
  imageUrl: string;
}
