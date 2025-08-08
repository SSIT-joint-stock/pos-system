/**
 * Client Error Classes (4xx)
 * Exports all client error classes that extend BaseClientError
 */

// Base class
export { BaseClientError } from './base';

// Client error classes
export { BadRequestError } from './bad-request';
export { UnauthorizedError } from './unauthorized';
export { ForbiddenError } from './forbidden';
export { NotFoundError } from './not-found';
export { ConflictError } from './conflict';
export { ValidationError } from './unprocessable-entity';
export { RateLimitError } from './too-many-requests'; 