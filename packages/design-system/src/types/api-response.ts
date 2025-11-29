export interface ApiSuccessResponse<T> {
  success: true;
  meta: {
    timestamp: string;
    version: string;
  };
  data: T;
  message: string;
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
