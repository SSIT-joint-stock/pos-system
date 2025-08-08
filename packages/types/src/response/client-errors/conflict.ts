import { BaseClientError } from './base';

/**
 * Conflict Error Class
 * Represents 409 Conflict errors following API structure guidelines
 */
export class ConflictError extends BaseClientError {
  constructor(
    message: string = 'Resource conflict',
    code: string = 'CONFLICT',
    details?: any
  ) {
    super(message, 409, code, details);
  }
}

export default ConflictError;