export type MessagePriority = 'low' | 'medium' | 'high';
export type MessageCategory = 'SYSTEM' | 'USER' | 'BACKUP' | 'SECURITY' | 'NOTIFICATION' | 'ERROR' | 'VERIFICATION' | 'PASSWORD_RESET';

export interface BaseMessageOptions {
  priority?: MessagePriority;
  category?: MessageCategory;
  disableNotification?: boolean;
}

export interface BaseMessagePayload {
  message: string;
  options?: BaseMessageOptions;
}

export interface BaseMessageResponse {
  success: boolean;
  error?: Error;
  timestamp: number;
  messageId?: string | number;
}

export interface BaseMessageJob {
  id: string;
  type: 'email' | 'telegram';
  payload: BaseMessagePayload;
  createdAt: number;
  attempts?: number;
  maxAttempts?: number;
} 