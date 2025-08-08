import { BaseClientError } from './base';

/**
 * Bad Request Error Class
 * Represents 400 Bad Request errors following API structure guidelines
 */
export class BadRequestError extends BaseClientError {
  constructor(
    message: string = 'Bad Request',
    code: string = 'BAD_REQUEST',
    details?: any
  ) {
    super(message, 400, code, details);
  }
}

export default BadRequestError;