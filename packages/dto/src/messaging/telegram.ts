import { BaseMessageOptions, BaseMessagePayload, BaseMessageResponse, BaseMessageJob } from './base';

export type TelegramParseMode = 'HTML' | 'Markdown' | 'MarkdownV2';

export interface TelegramOptions extends BaseMessageOptions {
  parseMode?: TelegramParseMode;
  replyToMessageId?: number;
  recipientId?: string;
  disableNotification?: boolean;
  extra?: {
    protect_content?: boolean;
    [key: string]: any;
  };
}

export interface TelegramPayload extends BaseMessagePayload {
  options: TelegramOptions;
}

export interface TelegramResponse extends BaseMessageResponse {
  messageId?: number;
  chatId?: number | string;
}

export interface TelegramJob extends BaseMessageJob {
  type: 'telegram';
  payload: TelegramPayload;
}

export interface TelegramQueueData {
  jobId: string;
  payload: TelegramPayload;
}

export interface TelegramWorkerResult {
  success: boolean;
  response?: TelegramResponse;
  error?: Error;
} 