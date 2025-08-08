// Request/Response Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface QueryParams extends PaginationParams, FilterParams {
  [key: string]: any;
}

// Authentication Types
export interface AuthenticationError extends Error {
  code: string;
  details?: any;
  httpStatus: number;
}