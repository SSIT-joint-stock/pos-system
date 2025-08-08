// Placeholder for actual DTOs
// Consider defining these based on your API's request/response structure

export interface SendEmailRequestDto {
  to: string | string[];
  subject: string;
  templateId?: string; // If using templates
  context?: Record<string, any>; // For template variables
  html?: string; // For direct HTML content
  text?: string; // For plain text content
}

export interface SendEmailResponseDto {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplateDto {
  id: string;
  name: string;
  subject: string;
  // Add other relevant template fields
}

export interface EmailTemplateListResponseDto {
  templates: EmailTemplateDto[];
}

// You might also need DTOs for:
// - Creating/updating email templates
// - Managing mailing lists
// - Tracking email status (sent, delivered, opened, bounced)
