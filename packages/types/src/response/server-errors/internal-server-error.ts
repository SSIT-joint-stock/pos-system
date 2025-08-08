import { BaseServerError } from './base';

/**
 * Internal Server Error Class
 * Represents 500 Internal Server Error following API structure guidelines
 */
export class InternalServerError extends BaseServerError {
  constructor(
    message: string = 'Internal server error',
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message, 500, code, details);
  }
}

export default InternalServerError;