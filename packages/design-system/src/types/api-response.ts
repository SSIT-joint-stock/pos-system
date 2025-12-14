export interface ApiSuccessResponse<T> {
  success: true;
  meta: {
    timestamp: string;
    version: string;
  };
  data: T;
  summary: T;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

// This is the union of both success + error
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
