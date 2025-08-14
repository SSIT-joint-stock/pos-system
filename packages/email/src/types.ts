import nodemailer from 'nodemailer';
import { AttachmentLike } from 'nodemailer/lib/mailer';

export interface EmailConfig {
  service: string;
  user: string;
  password: string;
  notificationEmail: string;
  templatePath?: string;
  defaultFrom?: string;
}

export interface EmailTemplate {
  subject: string;
  text?: string;
  html?: string;
  // template?: string;
  // context?: Record<string, any>;
}

export interface EmailOptions extends EmailTemplate {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  attachments?: AttachmentLike[];
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
}