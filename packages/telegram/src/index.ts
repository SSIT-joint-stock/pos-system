import { Telegraf } from 'telegraf';

import { TelegramConfig, MessageOptions, TelegramResponse, NotificationOptions, ExtraReplyMessage } from './types';
import { createTelegramConfig } from './config';
import { LoggerInstance, createLogger } from '@repo/logger';
import { } from 'telegraf/types';
export * from './types';
export * from './config';
export * from './queue';

export class TelegramService {
  private bot: Telegraf;
  private config: TelegramConfig;
  private logger: LoggerInstance;

  constructor(config: Partial<TelegramConfig> = {}, bot?: Telegraf) {
    this.config = createTelegramConfig(config);
    this.logger = createLogger({ 
      serviceName: 'TelegramService',
      enableConsole: true,
      enableLoki: true,
    });
    this.initializeBot(bot);
  }

  public getBot() {
    return this.bot;
  }

  private initializeBot(bot?: Telegraf) {
    if (!this.config.botToken) {
      throw new Error('Telegram bot token is required');
    }
    this.bot = bot || new Telegraf(this.config.botToken);
  }

  private formatMessage(message: string, parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'): string {
    // You can add more formatting logic here based on parseMode
    return message;
  }

  private createMessageExtra(options?: MessageOptions): ExtraReplyMessage {
    return {
      parse_mode: options?.parseMode || this.config.defaultParseMode,
      disable_notification: options?.disableNotification,
      ...options?.extra,
    };
  }

  public async sendMessage(message: string, options?: MessageOptions): Promise<TelegramResponse> {
    try {
      const formattedMessage = this.formatMessage(message, options?.parseMode);
      const extra = this.createMessageExtra(options);

      const response = await this.bot.telegram.sendMessage(
        this.config.recipientId,
        formattedMessage,
        extra
      );

      this.logger.info('Telegram message sent successfully', {
        messageId: response.message_id,
        chatId: response.chat.id,
      });

      return {
        success: true,
        messageId: response.message_id,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error('Failed to send Telegram message', {
        error,
        recipientId: this.config.recipientId,
      });

      return {
        success: false,
        error: error as Error,
        timestamp: Date.now(),
      };
    }
  }

  public async sendNotification(
    message: string,
    options?: NotificationOptions
  ): Promise<TelegramResponse> {
    const prefix = options?.priority ? `[${options.priority.toUpperCase()}] ` : '';
    const category = options?.category ? `[${options.category}] ` : '';
    const formattedMessage = `${prefix}${category}${message}`;

    return this.sendMessage(formattedMessage, {
      ...options,
      disableNotification: options?.priority === 'low',
    });
  }

  public async sendMarkdown(message: string): Promise<TelegramResponse> {
    return this.sendMessage(message, { parseMode: 'Markdown' });
  }

  public async sendHTML(message: string): Promise<TelegramResponse> {
    return this.sendMessage(message, { parseMode: 'HTML' });
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.bot.telegram.getMe();
      return true;
    } catch (error) {
      this.logger.error('Failed to verify Telegram connection', { error });
      return false;
    }
  }

  public async launch(onLaunch?: () => void): Promise<void> {
    try {
      // Chỉ launch nếu thực sự cần polling cho instance này
      this.logger.info('Attempting to launch Telegram bot (polling or webhook)...');
      await this.bot.launch(onLaunch); // Truyền launchOptions nếu có
      this.logger.info('Telegram bot launched successfully (polling or webhook mode).');
    } catch (error) {
      this.logger.error('Failed to launch Telegram bot', { error });
      throw error;
    }
  }

  public stop(reason?: string): void {
    this.logger.info('Attempting to stop Telegram bot polling/webhook...');
    this.bot.stop(reason);
    this.logger.info('Telegram bot stopped.', { reason });
  }
} 