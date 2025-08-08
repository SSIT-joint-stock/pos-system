import { BaseClientError } from './base';

/**
 * Forbidden Error Class
 * Represents 403 Forbidden errors following API structure guidelines
 */
export class ForbiddenError extends BaseClientError {
  constructor(
    message: string = 'Access denied',
    code: string = 'FORBIDDEN',
    details?: any
  ) {
    super(message, 403, code, details);
  }
}

export default ForbiddenError;