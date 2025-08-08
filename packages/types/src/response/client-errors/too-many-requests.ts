import { BaseClientError } from './base';

/**
 * Too Many Requests Error Class
 * Represents 429 Too Many Requests errors following API structure guidelines
 */
export class RateLimitError extends BaseClientError {
  constructor(
    message: string = 'Too many requests',
    code: string = 'RATE_LIMIT_EXCEEDED',
    details?: any
  ) {
    super(message, 429, code, details);
  }
}

export default RateLimitError; 