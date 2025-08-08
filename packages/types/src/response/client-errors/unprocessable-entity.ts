import { BaseClientError } from './base';

/**
 * Unprocessable Entity Error Class
 * Represents 422 Unprocessable Entity errors following API structure guidelines
 */
export class ValidationError extends BaseClientError {
  constructor(
    details: Record<string, string[]> = {},
    message: string = 'Validation failed',
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, 422, code, details);
  }
}

export default ValidationError;