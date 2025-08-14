import { AttachmentLike } from 'nodemailer/lib/mailer';
import { BaseMessageOptions, BaseMessagePayload, BaseMessageResponse, BaseMessageJob } from './base';

export interface EmailAttachment {
  filename: string;
  content?: string | Buffer;
  contentType?: string;
  encoding?: string;
  path?: string;
}

export interface EmailOptions extends BaseMessageOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  attachments?: EmailAttachment[];
  isHtml?: boolean;
  isMarkdown?: boolean;
}

export interface EmailPayload extends BaseMessagePayload {
  options: EmailOptions;
}

export interface EmailResponse extends BaseMessageResponse {
  to: string | string[];
  subject: string;
}

export interface EmailJob extends BaseMessageJob {
  type: 'email';
  payload: EmailPayload;
}

export interface EmailQueueData {
  jobId: string;
  payload: EmailPayload;
}

export interface EmailWorkerResult {
  success: boolean;
  response?: EmailResponse;
  error?: Error;
} 