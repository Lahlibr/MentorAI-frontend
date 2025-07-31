// api.models.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

