/**
 * Base Error Class for Client Errors (4xx)
 * Provides common functionality for all client error responses
 * Implements API structure guidelines
 */
export abstract class BaseClientError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  /**
   * Convert to API response format
   * Follows API structure guidelines
   */
  toResponse() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };
  }

  /**
   * Get error summary for logging
   */
  getSummary() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }

  /**
   * Check if error has details
   */
  hasDetails(): boolean {
    return this.details !== undefined && this.details !== null;
  }

  /**
   * Add additional details to the error
   */
  addDetails(details: Record<string, unknown>): this {
    this.details = { ...this.details, ...details };
    return this;
  }
}
