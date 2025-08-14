import { Telegraf } from "telegraf";

export type ExtraReplyMessage = Parameters<Telegraf['telegram']['sendMessage']>[2];

export interface TelegramConfig {
  botToken: string;
  recipientId: string;
  defaultParseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface MessageOptions {
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableNotification?: boolean;
  replyToMessageId?: number;
  recipientId?: string;
  extra?: Partial<ExtraReplyMessage>;
}

export interface TelegramResponse {
  success: boolean;
  messageId?: number;
  chatId?: number | string;
  error?: Error;
  timestamp: number;
}

export interface NotificationOptions extends MessageOptions {
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export type MessageFormatter = (message: string, options?: MessageOptions) => string; 