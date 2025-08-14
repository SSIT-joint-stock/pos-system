import { BaseClientError } from './base';

/**
 * Not Found Error Class
 * Represents 404 Not Found errors following API structure guidelines
 */
export class NotFoundError extends BaseClientError {
  constructor(
    resource: string = 'Resource',
    code: string = 'NOT_FOUND',
    details?: any
  ) {
    super(`${resource} not found`, 404, code, details);
  }
}

export default NotFoundError;